module.exports = function (sequelize, DataTypes) {
    return sequelize.define('projectsmaster', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'projectsmaster',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "projectsmaster_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
};
