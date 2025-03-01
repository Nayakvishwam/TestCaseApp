module.exports = function (sequelize, DataTypes) {
    return sequelize.define('modules', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'modules',
        schema: 'public',
        timestamps: false
    });
};
