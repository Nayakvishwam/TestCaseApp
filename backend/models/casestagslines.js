const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('casestagslines', {
    caseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'casesmaster',
        key: 'id'
      },
      unique: "unique_case_tag",
      field: 'case_id'
    },
    tagId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      },
      unique: "unique_case_tag",
      field: 'tag_id'
    }
  }, {
    sequelize,
    tableName: 'casestagslines',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "unique_case_tag",
        unique: true,
        fields: [
          { name: "case_id" },
          { name: "tag_id" },
        ]
      },
    ],
    primaryKey: false, // Ensure no auto-generated primary key
  });
};
