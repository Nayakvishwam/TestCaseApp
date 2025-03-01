module.exports = function (sequelize, DataTypes) {
    return sequelize.define("companiesmaster", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        street2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'state_id',
            references: {
                model: 'states',
                key: 'id'
            }
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'country_id',
            references: {
                model: 'countries',
                key: 'id'
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
    }, {
        timestamps: true,
        tableName: "companiesmaster"
    });
};