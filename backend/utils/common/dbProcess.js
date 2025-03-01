const { models } = require("../../config/db");

async function addBlukRecords(model, data, ignoreDuplicates, resource) {
    let finish = false;
    try {
        ignoreDuplicates = ignoreDuplicates ? ignoreDuplicates : false;
        model = models[model];
        if (resource) {
            data = data.map((entity) => {
                return { ...entity, ...resource }
            });
        }
        model.bulkCreate(data, {
            ignoreDuplicates
        });
        finish = !finish;
    } catch (error) {
        console.log(error);
    }
    return finish;
}
async function manageOneToManyLines(key, lines, value, model, mapId) {
    lines = lines.map(line => {
        line = {
            [mapId]: line,
            [key]: value
        };
        return line
    });
    await models[model].bulkCreate(lines);
}
module.exports = {
    addBlukRecords,
    manageOneToManyLines
}