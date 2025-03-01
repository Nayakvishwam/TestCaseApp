const propertiesReader = require('properties-reader');
const properties = propertiesReader('./utils/messages.properties');

function getApiResponse(key) {
    let response = {
        statusCode: 404,
        message: `Error: Unknown response key: ${key}`
    };
    if (properties.get(key)) {
        let message = properties.get(key);
        message = message.split(";");
        response = {
            statusCode: Number(message[0]),
            message: message[1]
        }
    }
    return response
}

module.exports = getApiResponse