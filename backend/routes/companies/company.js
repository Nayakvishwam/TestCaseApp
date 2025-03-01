const { body, param, query } = require('express-validator');
const { validator } = require("../../middelware/validators");
const { createCompany, updateCompany, getCompanyById, getCompanies } = require('../../controllers/companies/company');
const express = require("express");
const { utils } = require('../../utils/utils');
const router = express.Router();

function getCompanyValidators({
    update
}) {
    let validateCompany = [
        body('name').notEmpty().withMessage('Name is required'),
        body('stateId').isInt({ gt: 0 }).withMessage('Valid stateId is required'),
        body('countryId').isInt({ gt: 0 }).withMessage('Valid countryId is required'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('website').optional().isURL().withMessage('Invalid website URL'),
        body("logo")
            .optional()
            .isObject()
            .withMessage("Logo must be an object")
            .custom((value) => {
                if (!value.fileName || typeof value.fileName !== "string") {
                    throw new Error("logo.fileName is required and must be a string");
                }
                if (!value.fileExt || typeof value.fileExt !== "string" || !utils.allowedImageExtensions.includes(value.fileExt)) {
                    throw new Error("logo.fileExt is required and must be a string");
                }
                if (!value.base64Data || typeof value.base64Data !== "string") {
                    throw new Error("logo.base64Data is required and must be a valid Base64 string");
                }
                return true;
            }),
    ];
    if (update) {
        validateCompany.push(
            param('id').isUUID().withMessage('Invalid company ID')
        );
    }
    return validateCompany;
}

router.post('/createCompany', getCompanyValidators({}), validator, createCompany);
router.put('/updateCompany/:id', getCompanyValidators({ update: true }), validator, updateCompany);
router.get('/getCompany/:id', getCompanyById);
router.get(
    '/getCompanies',
    [
        query('page').notEmpty().withMessage('page is required'),
        query('totalRecords').notEmpty().withMessage('totalRecords is required')
    ],
    validator,
    getCompanies
);

module.exports = router;