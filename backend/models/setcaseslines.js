module.exports = function (sequelize, DataTypes) {
    return sequelize.define('setcaseslines', {
      setId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'set_id',
        onDelete: 'CASCADE'
      },
      caseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'case_id',
        references: {
          model: 'casesmaster',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    }, {
      sequelize,
      tableName: 'setcaseslines',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "setcases_set_case_unique",
          fields: [{ name: "set_id" }, { name: "case_id" }]
        }
      ]
    });
  };
  