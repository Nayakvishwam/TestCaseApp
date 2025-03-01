module.exports = function (sequelize, DataTypes) {
    return sequelize.define('setsmaster', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        folderId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: 'folder_id',
            references: {
                model: 'foldersmaster',
                key: 'id'
            }
        },
        key: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ownerId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'owner_id'
        }
    }, {
        sequelize,
        tableName: 'setsmaster',
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "setsmaster_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
};