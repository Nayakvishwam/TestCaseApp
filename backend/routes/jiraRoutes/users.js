const express = require("express");
const router = express.Router();
const { getUsers } = require("../../controllers/jira/users");
const { body } = require("express-validator");
const { validator } = require("../../middelware/validators");

router.post("/getUsers", [
    body("filters")
        .isArray({ min: 1 })
        .withMessage("Filters must be a non-empty array"),

    body("filters.*.queryParam")
        .exists()
        .withMessage("Each filter must have a 'key' property")
        .isString()
        .withMessage("'key' must be a string")
        .trim()
        .escape(),
    body("filters.*.value")
        .exists()
        .withMessage("Each filter must have a 'value' property")
        .trim()
        .escape()
],
    validator,
    getUsers
);

module.exports = router;