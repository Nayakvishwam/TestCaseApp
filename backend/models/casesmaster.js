module.exports = function (sequelize, DataTypes) {
  return sequelize.define('casesmaster', {
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
    preconditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    ownerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'owner_id'
    },
    autocasestatusId: {
      type: DataTypes.BIGINT,
      field: "auto_case_status_id",
      allowNull: false
    },
    projectId: {
      type: DataTypes.BIGINT,
      field: "project_id",
      allowNull: false
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
    priorityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'priorities',
        key: 'id'
      },
      field: 'priority_id'
    },
    statusId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'casesstatus',
        key: 'id'
      },
      field: 'status_id'
    },
    casetemplateId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'casestemplates',
        key: 'id'
      },
      field: 'casetemplateid'
    },
    typeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'casestypes',
        key: 'id'
      },
      field: 'type_id'
    },
    estimatedHourses: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'estimated_hourses'
    }
  }, {
    sequelize,
    tableName: 'casesmaster',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "casesmaster_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
