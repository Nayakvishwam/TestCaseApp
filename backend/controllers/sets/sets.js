const { Op } = require("sequelize");
const { models } = require("../../config/db");
const { manageOneToManyLines } = require("../../utils/common/dbProcess");
const getApiResponse = require("../../utils/messageRead");
const { getModelEntity, sendSuccessResponse, sendErrorResponse, utils, defaultFolders } = require("../../utils/utils");

async function createSet(req, res) {
    let result = utils.getResult();
    try {
        let setData = req.body;
        let data = await getModelEntity('caseSetEntity');
        let folderId = await models.foldersmaster.findOne({
            where: {
                name: defaultFolders[1]
            },
            attributes: ['id'],
            raw: true
        });
        data = {
            ...data,
            ...setData,
            ...{ folderId: folderId.id }
        };
        data = await models.setsmaster.create(data);
        data = data.toJSON();
        let key = "Tc-set/" + data.id;
        await models.setsmaster.update({
            key
        }, {
            where: {
                id: data.id
            }
        });
        let response = getApiResponse('SUCCESS_201');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = data;
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
async function getSets(req, res) {
    let result = utils.getResult();
    try {
        let { filters } = req.body;
        if (filters?.folders) {
            filters = {
                folderId: { [Op.in]: filters.folders }
            }
        }
        let { page, totalRecords } = req.query;
        totalRecords = Number(totalRecords);
        page = Number(page);
        let offset = (page - 1) * totalRecords;
        let limit = totalRecords;
        let { count, rows } = await models.setsmaster.findAndCountAll({
            raw: true,
            where: filters,
            limit,
            offset
        });
        for (let index = 0; index < rows.length; index++) {
            let row = rows[index];
            row.casesCount = await models.setcaseslines.count({
                where: {
                    setId: row.id
                }
            });
            rows[index] = row;
        };
        result.data = {
            totalRecords,
            totalPages: Math.ceil(count / totalRecords),
            currentPage: page,
            rows
        };
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res,
            result
        );
    }
};


async function assignCasesToSet(req, res) {
    let result = utils.getResult();
    try {
        const { setId, caseIds } = req.body;
        if (!setId || !Array.isArray(caseIds) || caseIds.length === 0) {
            return sendErrorResponse(res, { status_code: 400, message: "Invalid input data" });
        };
        await models.setcaseslines.destroy({
            where: {
                setId
            }
        });
        await manageOneToManyLines('setId', caseIds, setId, 'setcaseslines', 'caseId');
        let response = getApiResponse('SUCCESS_201');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendSuccessResponse(res, result);
    } catch (error) {
        console.error("Error assigning cases to set:", error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
}

module.exports = {
    createSet,
    getSets,
    assignCasesToSet
}