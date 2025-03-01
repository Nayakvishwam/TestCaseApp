const { models, sequelize } = require("../config/db");
const { addBlukRecords } = require("./common/dbProcess");
const Data = require("./syncData.json")

async function syncData() {
    await sequelize.sync({ alter: true });
    for (let key in Data) {
        let value = Data[key];
        let model = models[value.model];
        const existing = await model.findAll({
            where: {
                name: value.data.map(p => p.name)
            },
            attributes: ["name"]
        });

        const existingNames = existing.map(p => p.name);
        let dependency = value.depends;
        const newRecords = value.data.filter(p => !existingNames.includes(p.name));
        if (newRecords.length > 0) {
            let resource;
            if (dependency) {
                resource = await models[dependency.model].findOne({
                    where: {
                        [dependency.column]: dependency.value
                    },
                    attributes: dependency.attributes,
                    raw: true
                });
                resource = { ...dependency.entity, ...resource };
            };
            await addBlukRecords(value.model, value.data, true,resource);
        } else {
            console.log("Data exists");
        }
    };
};

module.exports = { syncData };