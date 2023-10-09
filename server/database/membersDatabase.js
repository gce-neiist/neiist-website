const db = require('./database');

const createMembers = async () => {
  try {
    await db.query(
      `CREATE TABLE members.users(
        "istId" varchar(10) PRIMARY KEY REFERENCES public.users("istId"),
        "registerDate" date NOT NULL,
        "electorDate" date NOT NULL,
        "startRenewalDate" date,
        "endRenewalDate" date,
        "renewalNotification" boolean DEFAULT FALSE
      );`,
    );
    await createRenewalNotificationsTrigger();
  } catch (err) {
    if (err.code === '42P07') ; // table already exists
    else { console.error(err); }
  }
};

const createRenewalNotificationsTrigger = async () => {
  try{
    await db.query(
      `CREATE OR REPLACE FUNCTION remove_expired_warned_users() RETURNS TRIGGER AS $$
      BEGIN
        UPDATE FROM members.users SET "renewalNotification" = FALSE
        WHERE "istId" IN (SELECT "istId" FROM members.users WHERE "endRenewalDate" < CURRENT_DATE);
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER remove_expired_warned_users_trigger
      AFTER INSERT OR UPDATE ON "renewalNotifications"
      FOR EACH ROW
      EXECUTE FUNCTION remove_expired_warned_users();
      `
    );
  } catch (err) {
    console.error(err); 
  }
};

const createMember = async (member) => {
  try {
    await db.query("INSERT INTO members.users VALUES($1, $2, $3, $4, $5)", [
      member.username,
      member.registerDate,
      member.electorDate,
      member.startRenewalDate,
      member.endRenewalDate,
    ]);
  } catch (err) {
    console.error(err);
  }
};

const updateMember = async (member) => {
  try {
    await db.query(
      'UPDATE members.users SET "registerDate" = $1::date, "electorDate" = $2::date, "startRenewalDate" = $3::date, "endRenewalDate" = $4::date WHERE "istId" = $5',
      [
        member.registerDate,
        member.electorDate,
        member.startRenewalDate,
        member.endRenewalDate,
        member.username,
      ]
    );
  } catch (err) {
    console.error(err);
  }
};

const getMember = async (username) => {
  let member;
  try {
    const memberResult = await db.query(
      'SELECT * FROM members.users WHERE "istId" = $1',
      [username]
    );
    [member] = memberResult.rows;
  } catch (err) {
    console.error(err);
  }
  return member;
};

const getActiveMembers = async (currDate, limitDate) => {
  let activeMembers;
  try {
    const activeMembersResult = await db.query(
      'SELECT * FROM members.users \
        WHERE "registerDate" > $1::date AND "endRenewalDate" > $2::date \
        ORDER BY length("istId"), "istId"',
      [limitDate, currDate]
    );
    activeMembers = activeMembersResult.rows;
  } catch (err) {
    console.error(err);
  }
  return activeMembers;
};

const getAllMembers = async () => {
  let allMembers;
  try {
    const allMembersResult = await db.query(
      'SELECT * FROM members.users ORDER BY length("istId"), "istId"'
    );
    allMembers = allMembersResult.rows;
  } catch (err) {
    console.error(err);
  }
  return allMembers;
};

const getRenewalNotifications = async () => {
  let members;
  try {
    const memberResult = await db.query(
      'SELECT * FROM members.users WHERE "renewalNotification" = TRUE',
    );
    members = memberResult.rows;
  } catch (err) {
    console.error(err);
  }
  return members;
};

const addRenewalNotification = async (username) => {
  try {
    await db.query('UPDATE members.users SET "renewalNotifications" = TRUE WHERE "istId"=$1;', [username]);
  } catch (err) {
    console.error(err);
  }
};

const removeRenewalNotification = async (username) => {
  try {
    await db.query('UPDATE members.users SET "renewalNotifications" = False WHERE "istId"=$1', [username]);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createMembers,
  createMember,
  updateMember,
  getMember,
  getActiveMembers,
  getAllMembers,
  addRenewalNotification,
  removeRenewalNotification,
  getRenewalNotifications,
};
