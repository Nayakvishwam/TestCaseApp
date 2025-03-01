const { createSet, getSets, assignCasesToSet } = require("../../controllers/sets/sets");
const express = require("express");
const router = express.Router();
const { validator } = require("../../middelware/validators");
const { body, query } = require("express-validator");

router.post(
    '/createSet',
    [
        body('title')
            .isString().withMessage('Title must be a string')
            .trim()
            .notEmpty().withMessage('Title is required'),

        body('ownerId').notEmpty().withMessage('Owner ID is required')
    ],
    validator,
    createSet
);

router.post("/getSets", [
    query('page').notEmpty().withMessage('page is required'),
    query('totalRecords').notEmpty().withMessage('totalRecords is required'),
],
    validator,
    getSets
);
router.post('/assigncases', [
    body('setId')
        .isInt({ gt: 0 }).withMessage('setId must be a positive integer'),
    body('caseIds')
        .isArray({ min: 1 }).withMessage('caseIds must be a non-empty array')
        .custom(caseIds => caseIds.every(id => Number.isInteger(id) && id > 0))
        .withMessage('Each caseId must be a positive integer'),
],
    validator,
    assignCasesToSet
);

module.exports = router;