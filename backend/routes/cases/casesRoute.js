const { body, query, param } = require("express-validator");
const { createCase, getCases, deleteCases, getCase, updateCase } = require("../../controllers/cases/cases");
const express = require("express");
const router = express.Router();
const { validator } = require("../../middelware/validators");
const getValidator = ({ update }) => {
    let validators = [
        body('title')
            .isString().withMessage('Title must be a string')
            .notEmpty().withMessage('Title is required'),

        body('files').optional().isArray().withMessage('Files must be an array'),
        body('files.*.base64Data').optional().isString().notEmpty().withMessage('Base64 data must be a non-empty string'),
        body('files.*.fileName').optional().isString().notEmpty().withMessage('File name must be a non-empty string'),
        body('files.*.fileExt').optional().isString().notEmpty().withMessage('File extension must be a non-empty string'),

        body("stages").optional()
            .isArray({ min: 1 })
            .withMessage("Stages must be a non-empty array"),

        body("stages.*.step")
            .optional()
            .isString()
            .withMessage("Step must be a string if provided"),

        body("stages.*.result")
            .optional()
            .isString()
            .withMessage("Result must be a string if provided"),


        body('description')
            .optional()
            .isString().withMessage('Description must be a string'),

        body('preconditions')
            .optional()
            .isString().withMessage('Preconditions must be a string'),

        body('step')
            .isString().withMessage('Step must be a string')
            .notEmpty().withMessage('Step is required'),

        body('result')
            .isString().withMessage('Result must be a string')
            .notEmpty().withMessage('Result is required'),

        body('ownerId')
            .isInt().withMessage('Owner ID must be an integer')
            .notEmpty().withMessage('Owner ID is required'),

        body('autocasestatusId')
            .isInt().withMessage('Auto Case Status ID must be an integer')
            .notEmpty().withMessage('Auto Case Status ID is required'),

        body('projectId')
            .isInt().withMessage('Project ID must be an integer')
            .notEmpty().withMessage('Project ID is required'),

        body('folderId')
            .optional()
            .isInt().withMessage('Folder ID must be an integer'),

        body('priorityId')
            .isInt().withMessage('Priority ID must be an integer')
            .notEmpty().withMessage('Priority ID is required'),

        body('statusId')
            .isInt().withMessage('Status ID must be an integer')
            .notEmpty().withMessage('Status ID is required'),

        body('casetemplateId')
            .isInt().withMessage('Case Template ID must be an integer')
            .notEmpty().withMessage('Case Template ID is required'),

        body('typeId')
            .isInt().withMessage('Type ID must be an integer')
            .notEmpty().withMessage('Type ID is required'),

        body('estimatedHourses')
            .optional()
            .isString().withMessage('Estimated Hours must be a string')
    ];
    if (update) {
        validators.push(
            param('id').isInt().withMessage('ID must be an integer')
                .notEmpty().withMessage('ID is required')
        );
        validators = validators.concat([       
        body("unlinkstageIds").optional()
            .isArray({ min: 1 })
            .withMessage("unlinkstageIds must be a non-empty array"),
        ])
    };
    return validators;
};
router.post("/createCase", getValidator({}),
    validator,
    createCase
);
router.put("/updateCase/:id", getValidator({ update: true }),
    validator,
    updateCase
);
router.delete("/deletecases", [
    body('caseIds')
        .isArray({ min: 1 }).withMessage('caseIds must be a non-empty array')
        .custom((caseIds) => caseIds.every(id => Number.isInteger(id)))
        .withMessage('Each caseId must be an integer')
],
    validator,
    deleteCases
);
router.post("/getCases", [
    query('page').notEmpty().withMessage('page is required'),
    query('totalRecords').notEmpty().withMessage('totalRecords is required'),
],
    validator,
    getCases
);
router.get("/getCase/:id", [
    param('id').isInt().withMessage('ID must be an integer')
        .notEmpty().withMessage('ID is required')
],
    validator,
    getCase
);
module.exports = router;
