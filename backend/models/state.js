module.exports = function (sequelize, DataTypes) {
    return sequelize.define('states', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'country_id',
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    }, {
        sequelize,
        tableName: 'states',
        schema: 'public',
        timestamps: true
    });
};
