module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FoldersFolderMapModules', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        folderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'foldersmaster',
                key: 'id'
            }
        },
        foldermapId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'foldersmaster',
                key: 'id'
            }
        }
    }, {
        tableName: 'folders_folder_map_modules',
        timestamps: false
    });
};
