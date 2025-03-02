const { Op } = require("sequelize");
const { models } = require("../../config/db");
const { manageOneToManyLines } = require("../../utils/common/dbProcess");
const getApiResponse = require("../../utils/messageRead");
const { getModelEntity, sendSuccessResponse, sendErrorResponse, utils, defaultFolders } = require("../../utils/utils");
const { filemanager } = require("../../utils/filemanager");
async function createCase(req, res) {
    let result = utils.getResult();
    try {
        let caseData = req.body;
        let { taglines, files, stages } = req.body;
        let data = await getModelEntity('caseEntity');
        data = {
            ...data,
            ...caseData
        };
        data = await models.casesmaster.create(data);
        data = data.toJSON();
        let key = "TC-" + data.id;
        await models.casesmaster.update({
            key
        }, {
            where: {
                id: data.id
            }
        });
        if (taglines?.length > 0) {
            await manageOneToManyLines('caseId', taglines, data.id, 'casestagslines', 'tagId');
        };
        if (stages?.length > 0) {
            stages = stages?.map(stage => {
                return { ...stage, caseId: data.id };
            })
            await models.stage_result.bulkCreate(stages);
        };
        if (files?.length > 0) {
            for (let file of files) {
                let fileManager = filemanager;
                let fileData = fileManager.convertFileToAny(file.base64Data, utils.form.base64);
                let defaultLocation = fileManager.getPath(`${fileManager.casesattaches}/${data.id}`);
                await fileManager.createNewDir(defaultLocation);
                fileManager.writeFile(`${defaultLocation}/${file.fileName}.${file.fileExt}`, fileData);
            }
        };
        let response = getApiResponse('SUCCESS_201');
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
async function deleteCases(req, res) {
    let result = utils.getResult();
    try {
        const { caseIds } = req.body;
        let where = { id: { [Op.in]: caseIds } };
        let existingCases = await models.casesmaster.findAll({
            where
        });

        if (existingCases.length !== caseIds.length) {
            return res.status(404).json({
                status_code: 404,
                message: "Some test cases not found."
            });
        };
        await models.casestagslines.destroy({
            where: {
                caseId: {
                    [Op.in]: caseIds
                }
            }
        });
        await models.stage_result.destroy({
            where: {
                caseId: {
                    [Op.in]: caseIds
                }
            }
        });
        await models.casesmaster.destroy({
            where
        });
        for (let caseId of caseIds) {
            let fileManager = filemanager;
            let defaultLocation = fileManager.getPath(`${fileManager.casesattaches}/${caseId}`);
            fileManager.removeAllFiles(defaultLocation);
            fileManager.removeDirSync(defaultLocation);
        };
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = "Test cases deleted successfully.";
        sendSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function updateCase(req, res) {
    let result = utils.getResult();
    try {
        let caseId = req.params.id;
        let caseData = req.body;
        let { taglines, files, unlinkstageIds, stages } = req.body;
        let existingCase = await models.casesmaster.count({ where: { id: caseId } });
        if (existingCase < 1) {
            let response = getApiResponse('ERROR_404');
            result.status_code = response.statusCode;
            result.message = "Test case not found.";
            return sendErrorResponse(res, result);
        };
        await models.casesmaster.update(caseData, {
            where: { id: caseId }
        });
        if (taglines?.length > 0) {
            console.log(taglines);
            await models.casestagslines.destroy({
                where: {
                    caseId
                }
            });
            await manageOneToManyLines('caseId', taglines, caseId, 'casestagslines', 'tagId');
        };
        if (files?.length > 0) {
            for (let file of files) {
                let fileManager = filemanager;
                let fileData = fileManager.convertFileToAny(file.base64Data, utils.form.base64);
                let defaultLocation = fileManager.getPath(`${fileManager.casesattaches}/${caseId}`);
                fileManager.removeAllFiles(defaultLocation);
                await fileManager.createNewDir(defaultLocation);
                fileManager.writeFile(`${defaultLocation}/${file.fileName}.${file.fileExt}`, fileData);
            }
        };
        if (stages?.length > 0) {
            stages = stages?.map(stage => {
                return { ...stage, caseId };
            })
            await models.stage_result.bulkCreate(stages);
        }
        if (unlinkstageIds?.length > 0) {
            await models.stage_result.destroy({
                where: {
                    id: {
                        [Op.in]: unlinkstageIds
                    }
                }
            });
        };
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = "Test case updated successfully.";
        sendSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function getCase(req, res) {
    let result = utils.getResult();
    try {
        const { id } = req.params;
        const caseData = await models.casesmaster.findByPk(id, {
            include: [
                { model: models.casesautomatestatus, as: "autocasestatus" },
                { model: models.casesstatus, as: "status" },
                { model: models.casestypes, as: "type" },
                { model: models.casestemplates, as: "cases" },
                { model: models.priorities, as: "priority" },
                {
                    model: models.foldersmaster, as: "folderscase", attributes: {
                        exclude: ['updatedAt', 'createdAt', 'moduleId']
                    }
                },
                {
                    model: models.casestagslines,
                    as: "casestagslines",
                    attributes: {
                        exclude: ['updatedAt', 'createdAt', 'id', 'caseId']
                    }
                }, {
                    model: models.stage_result,
                    as: "stagescaselines",
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                }]
        });
        if (!caseData) {
            return res.status(404).json({ message: 'Case not found' });
        };
        let fileManager = filemanager;
        let defaultLocation = fileManager.getPath(`${fileManager.casesattaches}/${caseData.id}`);
        let exists = fileManager.resourceExists(defaultLocation);
        caseData.attaches = null;
        if (exists) {
            caseData.attaches = fileManager.getAllFilesWithData(defaultLocation, utils.form.base64);
        };
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = caseData;
        sendSuccessResponse(res, result);
    } catch (error) {
        console.log(error)
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
}
async function getCases(req, res) {
    let result = utils.getResult();
    try {
        let { filters } = req.body;
        if (filters.folders) {
            filters = {
                folderId: { [Op.in]: filters.folders }
            }
        }
        let { page, totalRecords } = req.query;
        totalRecords = Number(totalRecords);
        page = Number(page);
        let offset = (page - 1) * totalRecords;
        let limit = totalRecords;
        let { count, rows } = await models.casesmaster.findAndCountAll({
            where: filters,
            raw: true,
            limit,
            offset,
            include: [
                { model: models.casesautomatestatus, as: "autocasestatus" },
                { model: models.casesstatus, as: "status" },
                { model: models.casestypes, as: "type" },
                { model: models.casestemplates, as: "cases" },
                { model: models.priorities, as: "priority" },
                { model: models.projectsmaster, as: "project" },
                {
                    model: models.foldersmaster, as: "folderscase", attributes: {
                        exclude: ['updatedAt', 'createdAt', 'moduleId']
                    }
                }]
        });
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
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res,
            result
        );
    }
}
module.exports = {
    createCase,
    getCases,
    updateCase,
    deleteCases,
    getCase
}