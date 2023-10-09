const { createAreas } = require('./areasDatabase');
const { createTheses } = require('./thesesDatabase');
const { createMembers, createRenewalNotifications } = require('./membersDatabase');
const {
  createCollaborators,
  createCurrentCollabView,
  createAdminsView,
  createGACMembersView,
  createCoordenatorsView
} = require('./collabsDatabase');
const { createElections, createOptions, createVotes } = require('./electionsDatabase');
const {} = require('/database')

const createSchemas = async () => {
  try {
    await db.query(
    `CREATE SCHEMA IF NOT EXISTS neiist;
     CREATE SCHEMA IF NOT EXISTS members;
     CREATE SCHEMA IF NOT EXISTS elections;
     CREATE SCHEMA IF NOT EXISTS thesis_master;
    `);
  } catch (err) {
    console.error(err);
  }
};

const initializeSchema = async () => {
  await createSchemas();

  await createAreas();
  await createTheses();
  await createMembers();
  await createCollaborators();
  await createCurrentCollabView();
  await createCoordenatorsView();
  await createGACMembersView();
  await createRenewalNotifications();
  await createAdminsView();
  await createElections();
  await createOptions();
  await createVotes();
};

module.exports = {
  initializeSchema,
};
