const { Sequelize } = require("sequelize");
const config = require("./config.json");
const { initModels } = require("../models/init-models");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: false
});

// Test the database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    }
};

testConnection();

let models = initModels(sequelize);

module.exports = { sequelize, models };
