const { users } = require("../../utils/jiraRoutes");
const { getQueryParams, sendSuccessResponse, sendErrorResponse, utils } = require("../../utils/utils");
const { jiraApiCaller } = require("../../utils/jiraApiCaller");
const getApiResponse = require("../../utils/messageRead");

async function getUsers(req, res) {
    let result=utils.getResult();
    try {
        let payload = req.body;
        let query = getQueryParams(payload.filters);
        let data = await jiraApiCaller(method = "GET", users.getAllUsers, query);
        let response = getApiResponse('SUCCESS_200');
        if (data.success) {
            result.status_code = response.statusCode;
            result.message = response.message;
            result.data = data.data;
        } else {
            result.status_code = data.status;
            result.message = data.message;
        }
        sendSuccessResponse(res, result);
    } catch (error) {
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res,
            result
        );
    }
};

module.exports = {
    getUsers
}