const express = require("express");
const router = express.Router();
const usersRouter = require("./jiraRoutes/users");
const foldersRouter = require("./folders/folders");
const casesRouter = require("./cases/casesRoute");
const setsRouter = require("./sets/sets");
const companyRouter = require("./companies/company");

router.use("/jira/users", usersRouter);
router.use("/cases", casesRouter);
router.use("/folders", foldersRouter);
router.use("/sets", setsRouter);
router.use("/company", companyRouter);

module.exports = router;