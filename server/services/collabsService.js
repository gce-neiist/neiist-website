const { collabsDatabase } = require('../database');

const checkCurrentCollab = async (username) => {
  const collabInfo = await collabsDatabase.getCurrentCollab(username);
  return collabInfo;
}

const checkAdmin = async (username) => {
  const collabInfo = await collabsDatabase.checkAdmin(username);
  return collabInfo;
}

const checkCoordenator = async (username) => {
  const collabInfo = await collabsDatabase.checkCoordenator(username);
  return collabInfo;
}

const checkGACMember = async (username) => {
  const collabInfo = await collabsDatabase.checkGACMember(username);
  return collabInfo;
}

const getCurrentCollabs = async () => {
  const collabInfo = await collabsDatabase.getCurrentCollabs();
  return collabInfo;
};

const getCurrentCollabsResume = async () => {
  const collabInfo = await collabsDatabase.getCurrentCollabsResume();
  return collabInfo;
};

const getCollabTeams = async (username) => {
  const collabInfo = await checkCurrentCollab(username);

  const teams = collabInfo.teams.replace("COOR-","").split(",");
  const teamMembers = await collabsDatabase.getCurrentTeamMembers(teams);

  return {teams: collabInfo.teams, teamMembers: teamMembers};
}

const addNewCollab = async (username, newCollabInfo, date=null) => 
  await collabsDatabase.addCollaborator(username, newCollabInfo, 
    date && new Date(date).toDateString()
  );

const removeCollab = async (username, date=null) => 
  await collabsDatabase.removeCollaborator(
    username,
    date && new Date(date).toDateString()
  );

module.exports = {
  checkCurrentCollab,
  checkAdmin,
  checkGACMember,
  checkCoordenator,
  getCurrentCollabs,
  getCurrentCollabsResume,
  getCollabTeams,
  addNewCollab,
  removeCollab,
};
