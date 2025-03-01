const axios = require("axios");
require("dotenv").config();

const JIRA_BASE_URL = process.env.JIRA_URL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

async function jiraApiCaller(method, endpoint, data = {}) {
    try {
        const response = await axios({
            method,
            url: `${JIRA_BASE_URL}${endpoint}`,
            data: ["POST", "PUT"].includes(method) ? data : undefined,
            params: ["GET", "DELETE"].includes(method) ? data : undefined,
            headers: {
                Authorization: `Bearer ${JIRA_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data || error.message,
            status: error.response?.status || 500,
        };
    }
}

module.exports = {jiraApiCaller};
