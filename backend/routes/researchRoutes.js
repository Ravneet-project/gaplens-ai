
const express = require('express');
const router = express.Router();

const {
  analyzeResearch
} = require('../controllers/researchController');

router.post('/analyze', analyzeResearch);

module.exports = router;
