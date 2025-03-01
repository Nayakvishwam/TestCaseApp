const { Op } = require("sequelize");
const { models } = require("../../config/db");
const { mapFolders } = require("../../utils/helper");
const getApiResponse = require("../../utils/messageRead");
const { sendErrorResponse, utils, sendSuccessResponse, defaultFolders } = require("../../utils/utils");

async function getFolders(req, res) {
    let { event } = req.params;
    let result = utils.getResult();
    try {
        let module = utils.getModule(event);
        let allmodule = utils.getModule(3);
        let folders = await models.foldersmaster.findAll({
            where: {},
            include: [
                {
                    model: models.folders_folder_map_modules,
                    as: "foldertofolders",
                    required: false
                },
                {
                    model: models.modules,
                    as: "modulesfolder",
                    where: { [Op.or]: [{ name: module }, { name: allmodule }] },
                    attributes: [],
                    required: true
                }
            ],
            attributes: ['id', 'name', 'moduleId'],
            order: [['id', 'ASC']]
        });
        let folderMappings = await models.folders_folder_map_modules.findAll();
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        data = await mapFolders(folders, folderMappings);
        result.data = data;
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
async function renameFolder(req, res) {
    let { event } = req.params;
    let payload = { ...req.body };
    let result = utils.getResult();
    try {
        if (payload.name != defaultFolders[0] && payload.name != defaultFolders[1]) {
            let module = utils.getModule(event);
            let name = payload?.name?.trim();

            if (payload && "name" in payload) {
                payload.name = name;
            }
            module = await models.modules.findOne({
                where: {
                    name: module
                },
                attributes: ['id'],
                raw: true
            });

            let count = await models.foldersmaster.count({
                where: {
                    name: payload.name,
                    moduleId: module?.id,
                    id: { [Op.not]: payload.folderId }
                }
            });
            if (count == 0) {
                await models.foldersmaster.update({
                    name: payload.name
                }, {
                    where: {
                        id: payload.folderId,
                        moduleId: module.id
                    }
                });
                let response = getApiResponse('SUCCESS_200');
                result.status_code = response.statusCode;
                result.message = response.message;
                sendSuccessResponse(res, result);
                return;
            } else {
                result.status_code = 409;
                result.message = "Folder already exists";
                sendErrorResponse(res, result);
                return;
            };
        } else {
            let response = getApiResponse('ERROR_422');
            result.status_code = response.statusCode;
            result.message = response.message;
            sendErrorResponse(res, result);
            return;
        }
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
async function createFolder(req, res) {
    let { event } = req.params;
    let payload = { ...req.body };
    let result = utils.getResult();

    try {
        let module = utils.getModule(event);

        let name = payload?.name?.trim();
        if (name != defaultFolders[0] && name != defaultFolders[1]) {
            if (payload && "name" in payload) {
                payload.name = name;
            }

            module = await models.modules.findOne({
                where: {
                    name: module
                },
                attributes: ['id'],
                raw: true
            });
            let count = await models.foldersmaster.count({
                where: {
                    name: payload.name,
                    moduleId: module?.id
                }
            });

            if (count == 0) {
                let foldermdouleline = {
                    folderId: payload.folderId
                };

                let folder = await models.foldersmaster.create({ name: payload.name, moduleId: module?.id });
                folder = folder.toJSON();
                foldermdouleline.foldermapId = folder.id;

                await models.folders_folder_map_modules.create({ ...foldermdouleline });

                let response = getApiResponse('SUCCESS_201');
                result.status_code = response.statusCode;
                result.message = response.message;
                sendSuccessResponse(res, result);
            } else {
                result.status_code = 409;
                result.message = "Folder already exists";
                sendErrorResponse(res, result);
            }
        } else {
            let response = getApiResponse('ERROR_422');
            result.status_code = response.statusCode;
            result.message = response.message;
            sendErrorResponse(res, result);
        }
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function moveTo(req, res) {
    try {
        let { event } = req.params;
        let result = utils.getResult();
        let module = utils.getModule(event);
        let allmodule = utils.getModule(3);
        module = await models.modules.findOne({
            where: {
                name: module
            },
            attributes: ['id'],
            raw: true
        });
        allmodule = await models.modules.findOne({
            where: {
                name: allmodule
            },
            attributes: ['id'],
            raw: true
        });
        let payload = { ...req.body };
        let name = payload?.name?.trim();
        if (payload && "name" in payload) {
            payload.name = name;
        };
        if (name != defaultFolders[1]) {
            let moveResource = await models.foldersmaster.findOne({
                where: {
                    name: payload.name,
                    [Op.or]: [{ moduleId: module.id }, { moduleId: allmodule.id }]
                },
                attributes: ['id'],
                raw: true
            });
            if (moveResource?.id) {
                let currentResource = await models.foldersmaster.findOne({
                    where: {
                        id: payload.folderId,
                        moduleId: module.id
                    },
                    attributes: ['id'],
                    raw: true
                });
                if (currentResource?.id != moveResource?.id) {
                    await models.folders_folder_map_modules.update({
                        folderId: moveResource.id
                    }, {
                        where: {
                            foldermapId: currentResource.id
                        }
                    });
                    let response = getApiResponse('SUCCESS_200');
                    result.status_code = response.statusCode;
                    result.message = response.message;
                    sendSuccessResponse(res, result);
                    return;
                } else {
                    let response = getApiResponse('ERROR_422');
                    result.status_code = response.statusCode;
                    result.message = response.message;
                    sendErrorResponse(res, result);
                    return;
                }
            } else {
                let response = getApiResponse('ERROR_422');
                result.status_code = response.statusCode;
                result.message = "Folder does not exists";
                sendErrorResponse(res, result);
                return;
            }
        } else {
            let response = getApiResponse('ERROR_422');
            result.status_code = response.statusCode;
            result.message = response.message;
            sendErrorResponse(res, result);
            return;
        }
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
async function deleteFolder(req, res) {
    let result = utils.getResult();
    try {
        let { id } = req.params;
        const resourcesIds = [];
        const resourceFolders = [];

        while (true) {
            let mapfolders = await models.folders_folder_map_modules.findOne({
                where: { folderId: id },
                raw: true
            });

            if (mapfolders) {
                id = mapfolders.foldermapId;
                resourcesIds.push(mapfolders.id);
                resourceFolders.push(mapfolders.foldermapId);
            } else {
                break;
            }
        }
        if (resourcesIds.length > 0) {
            await models.folders_folder_map_modules.destroy({
                where: { id: { [Op.in]: resourcesIds } }
            });
            await models.folders_folder_map_modules.destroy({
                where: { foldermapId: req.params.id }
            });
        } else {
            await models.folders_folder_map_modules.destroy({
                where: { foldermapId: id }
            });
        }

        if (resourceFolders.length > 0) {
            resourceFolders.push(req.params.id);
            await models.foldersmaster.destroy({
                where: { id: { [Op.in]: resourceFolders } }
            });
        } else {
            await models.foldersmaster.destroy({
                where: { id }
            });
        }


        // Send success response
        let response = getApiResponse("SUCCESS_200");
        result.status_code = response.statusCode;
        result.message = response.message;
        sendSuccessResponse(res, result);
        return;
    } catch (error) {
        console.error("Error deleting folder:", error);
        let response = getApiResponse("ERROR_500");
        result.status_code = response.statusCode;
        result.message = response.message;
        sendErrorResponse(res, result);
    }
};
module.exports = {
    getFolders,
    createFolder,
    renameFolder,
    moveTo,
    deleteFolder
};