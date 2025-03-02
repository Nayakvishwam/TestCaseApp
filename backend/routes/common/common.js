const express = require("express");
const { getStatus, getAutomationStatus, getTags, getPriorities, getTemplates, getTestCases, getProjects } = require("../../controllers/common/common");
const router = express.Router();

router.get('/casesstatus', getStatus);
router.get('/casesautomationstatus', getAutomationStatus);
router.get('/tags', getTags);
router.get('/projects', getProjects);
router.get('/priorities', getPriorities);
router.get('/casestemplates', getTemplates);
router.get('/casestypecases', getTestCases);

module.exports = router;