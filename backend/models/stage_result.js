module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'stageresultmaster',
    {
      step: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      result: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      caseId: {
        type: DataTypes.BIGINT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'stageresultmaster',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'stageresultmaster_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
