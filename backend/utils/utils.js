let data = require("./modelEntities.json");

async function sendSuccessResponse(res, params) {
    return res.status(200).send(params);
};
async function sendErrorResponse(res, params) {
    return res.status(params.status_code).send(params);
};
function Utils() {
    this.result = {
        status_code: null,
        message: null
    };
    this.form={
        base64:"base64"
    };
    this.modules = {
        0: "Cases",
        1: "Sets",
        2: "Cycles",
        3: "All"
    };
    this.allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    this.getResult = function getResult() {
        let result = { ...this.result };
        return result;
    };
    this.getModule = function getModule(event) {
        return this.modules[event];
    }
};
async function getModelEntity(modelkey) {
    let entity = data[modelkey];
    return entity;
};
function getQueryParams(filters) {
    let query = filters?.reduce((accumulator, currenValue, index) => {
        accumulator[currenValue.queryParam] = currenValue.value;
        return accumulator;
    }, {});
    return query;
};
var utils = new Utils();
module.exports = {
    getQueryParams,
    sendSuccessResponse,
    sendErrorResponse,
    getModelEntity,
    port: 5170,
    getResult: utils.getResult,
    utils,
    defaultFolders: {
        0: "All",
        1: "Not Assigned"
    }
}