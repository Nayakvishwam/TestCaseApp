const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('casesautomatestatus', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique:true
    }
  }, {
    sequelize,
    tableName: 'casesautomatestatus',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "casesautomatestatus_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
