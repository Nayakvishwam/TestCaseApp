module.exports = function (sequelize, DataTypes) {
    return sequelize.define('countries', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique:true
        },
        code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        tableName: 'countries',
        schema: 'public',
        timestamps: true
    });
};
