const { models } = require("../../config/db");
const getApiResponse = require("../../utils/messageRead");
const { sendSuccessResponse, utils, sendErrorResponse } = require("../../utils/utils");

async function getStatus(req, res) {
    let result = utils.getResult();
    try {
        const data = await models.casesstatus.findAll();
        let response = getApiResponse('ERROR_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
        sendSuccessResponse(res, result);
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function getTemplates(req, res) {
    let result = utils.getResult();
    try {
        const data = await models.casestemplates.findAll();
        let response = getApiResponse('ERROR_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
        sendSuccessResponse(res, result);
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function getPriorities(req, res) {
    let result = utils.getResult();
    try {
        const data = await models.priorities.findAll();
        let response = getApiResponse('ERROR_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
        sendSuccessResponse(res, result);
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};

async function getTestCases(req, res) {
    let result = utils.getResult();
    try {
        const data = await models.casestypecases.findAll();
        let response = getApiResponse('ERROR_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
        sendSuccessResponse(res, result);
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function getAutomationStatus(req, res) {
    let result = utils.getResult();
    try {
        const data = await models.casesautomatestatus.findAll();
        let response = getApiResponse('ERROR_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
        sendSuccessResponse(res, result);
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};

async function getTags(req, res) {
    try {
        const data = await models.tags.findAll();
        let response = getApiResponse('ERROR_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
}
module.exports = {
    getStatus,
    getAutomationStatus,
    getTags,
    getPriorities,
    getTemplates,
    getTestCases
};