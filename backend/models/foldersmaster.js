module.exports = function (sequelize, DataTypes) {
    return sequelize.define('foldersmaster', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        moduleId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'module_id',
            references: {
                model: 'modules',
                key: 'id'
            }
        }
    }, {
        sequelize,
        tableName: 'foldersmaster',
        schema: 'public',
        timestamps: true
    });
}