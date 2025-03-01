const { models } = require("../../config/db");
const { filemanager } = require("../../utils/filemanager");
const getApiResponse = require("../../utils/messageRead");
const { sendErrorResponse, utils, sendSuccessResponse } = require("../../utils/utils");
const path = require('path');

async function createCompany(req, res) {
    let result = utils.getResult();
    try {
        const {
            name,
            street,
            street2,
            city,
            stateId,
            zip,
            countryId,
            phone,
            mobile,
            email,
            website,
            logo
        } = req.body;

        const state = await models.state.count({
            where: {
                id: stateId,
                countryId
            }
        });
        const country = await models.countries.count({
            where: { id: countryId }
        });

        if (!(state > 0) || !(country > 0)) {
            let response = getApiResponse('ERROR_400');
            result.status_code = response.statusCode;
            result.message = response.message;
            sendErrorResponse(res, result);
            return;
        }

        let company = await models.companiesmaster.create({
            name,
            street,
            street2,
            city,
            stateId,
            zip,
            countryId,
            phone,
            mobile,
            email,
            website
        });
        if (logo) {
            let fileManager = filemanager;
            let fileData = fileManager.convertFileToAny(logo.base64Data, utils.form.base64);
            let defaultLocation = fileManager.getPath(`${fileManager.companiesLogos}/${company.id}`);
            await fileManager.createNewDir(defaultLocation);
            fileManager.writeFile(`${defaultLocation}/${logo.fileName}.${logo.fileExt}`, fileData);
        }
        let response = getApiResponse('SUCCESS_201');
        result.status_code = response.statusCode;
        result.message = response.message;
        sendSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        return sendErrorResponse(res, result);
    }
};

async function updateCompany(req, res) {
    let result = utils.getResult();

    try {
        const { id } = req.params;
        const updates = req.body;

        const company = await models.companiesmaster.findByPk(id);
        if (!company) {
            let response = getApiResponse('ERROR_400');
            result.status_code = response.statusCode;
            result.message = response.message;
            return sendErrorResponse(res, result);
        }

        if (updates.stateId) {
            const stateExists = await models.state.count({ where: { id: updates.stateId } });
            if (!stateExists) {
                let response = getApiResponse('ERROR_400');
                result.status_code = response.statusCode;
                result.message = response.message;
                return sendErrorResponse(res, result);
            }
        }

        if (updates.countryId) {
            const countryExists = await models.countries.count({ where: { id: updates.countryId } });
            if (!countryExists) {
                let response = getApiResponse('ERROR_400');
                result.status_code = response.statusCode;
                result.message = response.message;
                return sendErrorResponse(res, result);
            }
        }

        await company.update(updates);
        if (updates.logo) {
            let { logo } = updates;
            let fileManager = filemanager;
            let defaultLocation = fileManager.getPath(`${fileManager.companiesLogos}/${company.id}`);
            fileManager.removeAllFiles(defaultLocation);
            let fileData = fileManager.convertFileToAny(logo.base64Data, utils.form.base64);
            fileManager.writeFile(`${defaultLocation}/${logo.fileName}.${logo.fileExt}`, fileData);
        }
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        return sendSuccessResponse(res, result);
    } catch (error) {
        console.log(error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        return sendErrorResponse(res, result);
    }
};

async function getCompanyById(req, res) {
    let result = utils.getResult();
    try {
        const { id } = req.params;

        let company = await models.companiesmaster.findByPk(id, { raw: true });

        if (!company) {
            let response = getApiResponse('ERROR_404');
            result.status_code = response.statusCode;
            result.message = response.message;
            return sendErrorResponse(res, result);
        }
        let fileManager = filemanager;
        let defaultLocation = fileManager.getPath(`${fileManager.companiesLogos}/${company.id}`);
        let exists = fileManager.resourceExists(defaultLocation);
        company.logo = null;
        if (exists) {
            company.logo = fileManager.getAllFilesWithData(defaultLocation, utils.form.base64);
            if (company.logo?.length > 0) {
                company.logo = company.logo[0];
            };
        } else {
            const filePath = path.join(__dirname, '../../', 'public/logo/usercompanies/');
            company.logo = fileManager.getAllFilesWithData(filePath, utils.form.base64);
        };
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = company;
        return sendSuccessResponse(res, result);

    } catch (error) {
        console.error("Error fetching company:", error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        return sendErrorResponse(res, result);
    }
};

async function getCompanies(req, res) {
    let result = utils.getResult();
    try {
        let { page, totalRecords } = req.query;

        page = parseInt(page) || 1;
        totalRecords = parseInt(totalRecords) || 10;

        if (page < 1 || totalRecords < 1) {
            let response = getApiResponse('ERROR_404');
            result.status_code = response.statusCode;
            result.message = response.message;
            return sendErrorResponse(res, result);
        }

        const offset = (page - 1) * totalRecords;

        const { rows, count } = await models.companiesmaster.findAndCountAll({
            limit: totalRecords,
            offset: offset
        });
        let response = getApiResponse('SUCCESS_200');
        result.status_code = response.statusCode;
        result.message = response.message;
        result.data = {
            currentPage: page,
            totalRecords: count,
            totalPages: Math.ceil(count / totalRecords),
            rows
        };
        return sendSuccessResponse(res, result);

    } catch (error) {
        console.error("Error fetching company:", error);
        let response = getApiResponse('ERROR_500');
        result.status_code = response.statusCode;
        result.message = response.message;
        return sendErrorResponse(res, result);
    }
};

module.exports = {
    createCompany,
    updateCompany,
    getCompanyById,
    getCompanies
};