const db = require('./database');

const createElections = async () => {
  try {
    await db.query(
      `CREATE TABLE elections.events(
        id serial PRIMARY KEY,
        name text,
        "startDate" date,
        "endDate" date
      );`,
    );
  } catch (err) {
    if (err.code === '42P07') ; // table already exists
    else { console.error(err); }
  }
};

const createOptions = async () => {
  try {
    await db.query(
      `CREATE TABLE elections.options(
        id serial PRIMARY KEY,
        name text,
        "electionId" INTEGER REFERENCES elections.events(id) ON DELETE CASCADE ON UPDATE CASCADE
      );`,
    );
  } catch (err) {
    if (err.code === '42P07') ; // table already exists
    else { console.error(err); }
  }
};

const createVotes = async () => {
  try {
    await db.query(
      `CREATE TABLE elections.votes(
        "istId" varchar(10) REFERENCES public.users("istId"),
        "electionId" INTEGER REFERENCES elections.events(id) ON DELETE CASCADE ON UPDATE CASCADE,
        "optionId" INTEGER REFERENCES elections.options(id) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("istId", "electionId")
      );`,
    );
  } catch (err) {
    if (err.code === '42P07') ; // table already exists
    else { console.error(err); }
  }
};

const addOption = async (electionId, optionName) => {
  try {
    db.query('INSERT INTO elections.options(name, "electionId") VALUES($1, $2)', [optionName, electionId]);
  } catch (err) {
    console.error(err);
  }
};

const createElection = async (election) => {
  try {
    const createdElectionResult = await db.query('INSERT INTO elections.events(name, "startDate", "endDate") VALUES($1, $2, $3) RETURNING *', [election.name, election.startDate, election.endDate]);
    const [createdElection] = createdElectionResult.rows;
    const electionId = createdElection.id;
    election.options.forEach((optionName) => addOption(electionId, optionName));
  } catch (err) {
    console.error(err);
  }
};

const getVotes = async (electionId, optionId) => {
  let votes;
  try {
    const votesResult = await db.query(
      `SELECT COUNT(*)
      FROM eletions.votes
      WHERE "electionId"=$1
      AND "optionId"=$2;`,
      [electionId, optionId],
    );
    votes = votesResult.rows[0].count;
  } catch (err) {
    console.error(err);
  }
  return votes;
};

const getOptions = async (electionId) => {
  let optionsVotes;
  try {
    const optionsResult = await db.query('SELECT * FROM elections.options WHERE "electionId"=$1', [electionId]);
    const options = optionsResult.rows;
    optionsVotes = await Promise.all(options.map(async (option) => {
      const optionVotes = option;
      optionVotes.votes = await getVotes(electionId, option.id);
      return optionVotes;
    }));
  } catch (err) {
    console.error(err);
  }
  return optionsVotes;
};

const getActiveElections = async (currDate) => {
  let electionsOptions;
  try {
    const electionsResult = await db.query('SELECT * FROM elections.events WHERE $1 BETWEEN "startDate" AND "endDate" ', [currDate]);
    const elections = electionsResult.rows;
    electionsOptions = await Promise.all(elections.map(async (election) => {
      const electionOptions = election;
      electionOptions.options = await getOptions(election.id);
      return electionOptions;
    }));
  } catch (err) {
    console.error(err);
  }
  return electionsOptions;
};

const getAllElections = async () => {
  let electionsOptions;
  try {
    const electionsResult = await db.query('SELECT * FROM elections.events');
    const elections = electionsResult.rows;
    electionsOptions = await Promise.all(elections.map(async (election) => {
      const electionOptions = election;
      electionOptions.options = await getOptions(election.id);
      return electionOptions;
    }));
  } catch (err) {
    console.error(err);
  }
  return electionsOptions;
};

const createVote = async (electionId, vote) => {
  try {
    await db.query('INSERT INTO elections.votes values($1, $2, $3)', [vote.username, electionId, vote.optionId]);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createElections,
  createOptions,
  createVotes,
  createElection,
  getActiveElections,
  getAllElections,
  createVote,
};
