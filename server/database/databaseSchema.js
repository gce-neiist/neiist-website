const { createAreas } = require('./areasDatabase');
const { createTheses } = require('./thesesDatabase');
const { createMembers } = require('./membersDatabase');
const { createElections, createOptions, createVotes } = require('./electionsDatabase');
const { createArticles } = require('./articlesDatabase');

const initializeSchema = async () => {
  await createAreas();
  await createTheses();
  await createMembers();
  await createElections();
  await createOptions();
  await createVotes();
  await createArticles();
};

module.exports = {
  initializeSchema,
};
