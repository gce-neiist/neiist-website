const db = require("./database");

const createCollaborators = async () => {
  try {
    await db.query(
      `CREATE TABLE neiist.collaborators(
        "istId" varchar(10) REFERENCES public.users("istId"),
        teams text[] NOT NULL,
        role text DEFAULT 'COLLAB' NOT NULL,
        "subRole" text,
        "fromDate" date DEFAULT CURRENT_DATE NOT NULL,
        "toDate" date DEFAULT '9999-12-31' NOT NULL,
      
        PRIMARY KEY ("istId", "fromDate", "toDate")
      );`
    );
  } catch (err) {
    if (err.code !== "42P07") {
      console.error(err);
    }
  }
};

const createCurrentCollabView = async () => {
  try {
    await db.query(
      `CREATE OR REPLACE VIEW neiist.curr_collaborators AS
        SELECT *
        FROM neiist.collaborators
        WHERE "fromDate" <= current_date::date
          AND "toDate" > current_date::date;
      `
    );
  } catch (err) {
    console.error(err);
  }
};

const createAdminsView = async () => {
  try {
    await db.query(
      `CREATE OR REPLACE VIEW public.admins AS
        SELECT "istId"
        FROM public.users
        WHERE 'admin'=ANY(permission);`
    );
  } catch (err) {
    console.error(err);
  }
};

const createGACMembersView = async () => {
  try {
    await db.query(
      `CREATE OR REPLACE VIEW public.gac_members AS
      SELECT "istId"
      FROM public.users
      WHERE 'gac'=ANY(permission)
        OR 'admin'=ANY(permission);`
    );
  } catch (err) {
    console.error(err);
  }
};

const createCoordenatorsView = async () => {
  try {
    await db.query(
      `CREATE OR REPLACE VIEW neiist.coordenators AS
      SELECT *
      FROM neiist.curr_collaborators
       WHERE (SELECT unnest("teams")) LIKE '%COOR%';`
    );
  } catch (err) {
    console.error(err);
  }
};

const addCollaborator = async (username, collab) => {
  try {
    await db.query(
      `INSERT INTO neiist.collaborators("istId", teams)
      VALUES($1, $2::text[])`,
      [username, collab.teams]
    );
  } catch (err) {
    console.error(err);
  }
};

const removeCollaborator = async (username) => {
  try {
    await db.query(
      `UPDATE neiist.curr_collaborators SET "toDate" = current_date WHERE "istId" = $1`,
      [username]
    );
  } catch (err) {
    console.error(err);
  }
};

const getCurrentCollab = async (username) => {
  let collab;
  try {
    const collabResult = await db.query(
      `SELECT "istId", teams 
      FROM neiist.curr_collaborators
      WHERE "istId"=$1;`,
      [username]
    );
    [collab] = collabResult.rows;
  } catch (err) {
    console.error(err);
  }
  return collab;
};

const getCurrentCollabs = async () => {
  let collabs;
  try {
    const collabsResult = await db.query(
      `SELECT
        neiist.curr_collaborators."istId",
        name, email, campus, role, "subRole", "teams"
      FROM (neiist.curr_collaborators NATURAL JOIN public.users) as cc
      FULL JOIN members.users as m ON cc."istId"=m."istId"
      WHERE cc.username IS NOT NULL
      ORDER BY name ASC`
    );
    collabs = collabsResult.rows;
  } catch (err) {
    console.error(err);
  }
  return collabs;
};

const getCurrentCollabsResume = async () => {
  let collabs;
  try {
    const collabsResult = await db.query(
      `SELECT CONCAT(
        split_part(m.name, ' ', 1), ' ', reverse(split_part(reverse(m.name), ' ', 1))
        ) AS name, cc.teams
      FROM (neiist.curr_collaborators NATURAL JOIN public.users) as cc
      FULL JOIN members.users as m ON cc.username=m.username
      WHERE m.name IS NOT NULL AND cc."istId" IS NOT NULL
      ORDER BY name ASC;`
    );
    collabs = collabsResult.rows;
  } catch (err) {
    console.error(err);
  }
  return collabs;
};

const getCurrentTeamMembers = async (teamsAux) => {
  //It accepts one team, or multiple ones.
  let collabs;
  const teams = `%${teamsAux.join("%,%")}%`;
 
  try {
    const collabsResult = await db.query(
      `SELECT cc."istId", name, campus, teams
      FROM (neiist.curr_collaborators NATURAL JOIN public.users) as cc
      FULL JOIN members.users as m
      ON cc."istId"=m."istId"
      WHERE teams LIKE ANY(string_to_array($1,','))
      ORDER BY name ASC`,
      [teams]
    );
    collabs = collabsResult.rows;
  } catch (err) {
    console.error(err);
  }
  return collabs;
};

const checkAdmin = async (username) => {
  let admin;
  try {
    const adminResult = await db.query(
      `SELECT "istId"
      FROM public.admins
      WHERE "istId" LIKE $1;`,
      [username]
    );
    [admin,] = adminResult.rows;
  } catch (err) {
    console.error(err);
  }
  return admin!==undefined && admin.username === username;
};

const checkGACMember = async (username) => {
  let gac;
  try {
    const gacResult = await db.query(
      `SELECT "istId"
      FROM public.gac_members
      WHERE "istId" LIKE $1;`,
      [username]
    );
    [gac,] = gacResult.rows;
  } catch (err) {
    console.error(err);
  }
  return gac!==undefined && gac.username === username;
};

const checkCoordenator = async (username) => {
  let coor;
  try {
    const coorResult = await db.query(
      `SELECT "istId"
      FROM neiist.coordenators
      WHERE "istId" LIKE $1;`,
      [username]
    );
    [coor,] = coorResult.rows;
  } catch (err) {
    console.error(err);
  }
  return coor!==undefined && coor.username === username;
};

module.exports = {
  createCollaborators,
  createCurrentCollabView,
  createCoordenatorsView,
  createGACMembersView,
  createAdminsView,
 
  addCollaborator,
  removeCollaborator,
 
  getCurrentCollab,
  getCurrentCollabs,
  getCurrentCollabsResume,
  getCurrentTeamMembers,

  checkAdmin,
  checkGACMember,
  checkCoordenator,
};
