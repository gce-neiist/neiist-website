const express = require('express');
const { collabsService } = require('../services');

const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
  const members = await collabsService.getCurrentCollabs();
  res.json(members);
});

router.post('/add/:username', async (req, res) => {
  const { username } = req.params;
  const newCollabInfo = req.body;

  await collabsService.addNewCollab(username,newCollabInfo);
  res.json('OK');
});

router.post('/remove/:username', async (req, res) => {
  const { username } = req.params;
  await collabsService.removeCollab(username);
  res.json('OK');
});

router.get('/info/:username', async (req, res) => {
  const { username } = req.params;
  const state = await collabsService.getCollabTeams(username);
  res.json(state);
});

module.exports = router;
