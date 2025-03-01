const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('casesstatus', {
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
    tableName: 'casesstatus',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "casesstatus_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
