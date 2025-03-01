var DataTypes = require("sequelize").DataTypes;
var _casesmaster = require("./casesmaster");
var _casesstatus = require("./casesstatus");
var _casestagslines = require("./casestagslines");
var _casestypes = require("./casestypes");
var _priorities = require("./priorities");
var _modules = require("./modules");
var _setsmaster = require("./setsmaster");
var _foldersmaster = require("./foldersmaster");
var _setcaseslines = require("./setcaseslines");
var _folders_folder_map_modules = require("./folders_folder_map_modules");
var _tags = require("./tags");
var _projectsmaster = require("./projectsmaster");
var _companiesmaster = require("./companiesmaster");
var _state = require("./state");
var _countries = require("./countries");
var _casestypecases = require("./casestypes");
var _casestemplates = require("./casestemplates");
var _casesautomatestatus = require("./casesautomatestatus");
var _stage_result = require("./stage_result");

function initModels(sequelize) {
  var priorities = _priorities(sequelize, DataTypes);
  var tags = _tags(sequelize, DataTypes);
  var modules = _modules(sequelize, DataTypes);
  var setsmaster = _setsmaster(sequelize, DataTypes);
  var foldersmaster = _foldersmaster(sequelize, DataTypes);
  var casesautomatestatus = _casesautomatestatus(sequelize, DataTypes);
  var casesstatus = _casesstatus(sequelize, DataTypes);
  var casestypes = _casestypes(sequelize, DataTypes);
  var casesmaster = _casesmaster(sequelize, DataTypes);
  var casestypecases = _casestypecases(sequelize, DataTypes);
  var casestemplates = _casestemplates(sequelize, DataTypes);
  var casestagslines = _casestagslines(sequelize, DataTypes);
  var folders_folder_map_modules = _folders_folder_map_modules(sequelize, DataTypes);
  var setcaseslines = _setcaseslines(sequelize, DataTypes);
  var projectsmaster = _projectsmaster(sequelize, DataTypes);
  var companiesmaster = _companiesmaster(sequelize, DataTypes);
  var countries = _countries(sequelize, DataTypes);
  var state = _state(sequelize, DataTypes);
  var stage_result = _stage_result(sequelize, DataTypes);

  casestagslines.removeAttribute('id');

  casesmaster.belongsTo(casesautomatestatus, { as: "autocasestatus", foreignKey: "autocasestatusId" });
  casesautomatestatus.hasOne(casesmaster, { as: "casesmasters", foreignKey: "autocasestatusId" });
  casestagslines.belongsTo(casesmaster, { as: "case", foreignKey: "caseId" });
  casesmaster.hasMany(casestagslines, { as: "casestagslines", foreignKey: "caseId" });
  stage_result.belongsTo(casesmaster, { as: "case", foreignKey: "caseId" });
  casesmaster.hasMany(stage_result, { as: "stagescaselines", foreignKey: "caseId" });
  casesmaster.belongsTo(foldersmaster, { as: "folderscase", foreignKey: "folderId" });
  foldersmaster.hasOne(casesmaster, { as: "casesfolders", foreignKey: "folderId" });
  casesmaster.belongsTo(casestemplates, { as: "cases", foreignKey: "casetemplateId" });
  casestemplates.hasOne(casesmaster, { as: "casestemplates", foreignKey: "casetemplateId" });
  casesmaster.belongsTo(casesstatus, { as: "status", foreignKey: "statusId" });
  casesstatus.hasOne(casesmaster, { as: "casesmasters", foreignKey: "statusId" });
  casesmaster.belongsTo(casestypes, { as: "type", foreignKey: "typeId" });
  casestypes.hasOne(casesmaster, { as: "casesmasters", foreignKey: "typeId" });
  casesmaster.belongsTo(priorities, { as: "priority", foreignKey: "priorityId" });
  priorities.hasMany(casesmaster, { as: "casesmasters", foreignKey: "priorityId" });
  casesmaster.belongsTo(projectsmaster, { as: "project", foreignKey: "projectId" });
  projectsmaster.hasOne(casesmaster, { as: "casesmasters", foreignKey: "projectId" });
  casestagslines.belongsTo(tags, { as: "tag", foreignKey: "tagId" });
  tags.hasMany(casestagslines, { as: "casestagslines", foreignKey: "tagId" });
  foldersmaster.belongsTo(modules, { as: "modulesfolder", foreignKey: "moduleId" });
  modules.hasMany(foldersmaster, { as: "foldermodules", foreignKey: "moduleId" });
  folders_folder_map_modules.belongsTo(foldersmaster, { as: "folderstofolder", foreignKey: "folderId" });
  foldersmaster.hasMany(folders_folder_map_modules, { as: "foldertofolders", foreignKey: "folderId" });
  folders_folder_map_modules.belongsTo(foldersmaster, { as: "folderstomapfolder", foreignKey: "foldermapId" });
  foldersmaster.hasMany(folders_folder_map_modules, { as: "foldertomapfolders", foreignKey: "foldermapId" });
  setsmaster.belongsTo(foldersmaster, { as: "foldersset", foreignKey: "folderId" });
  foldersmaster.hasMany(casesmaster, { as: "setsfolders", foreignKey: "folderId" });
  casesmaster.hasMany(setcaseslines, { foreignKey: 'caseId', as: 'sets' });
  setcaseslines.hasMany(setsmaster, { foreignKey: 'setId', as: 'cases' });
  setcaseslines.belongsTo(casesmaster, { foreignKey: 'caseId', as: 'case' });
  setcaseslines.belongsTo(setsmaster, { foreignKey: 'setId', as: 'set' });
  state.belongsTo(countries, { as: "country", foreignKey: "countryId" });
  countries.hasMany(state, { as: "statesList", foreignKey: "countryId" });
  countries.belongsTo(companiesmaster, { as: "companiescountry", foreignKey: "countryId" });
  companiesmaster.hasMany(countries, { as: "cuntriescompany", foreignKey: "countryId" });
  state.belongsTo(companiesmaster, { as: "companiesState", foreignKey: "stateId" });
  companiesmaster.hasMany(state, { as: "statesCompanies", foreignKey: "stateId" });

  return {
    priorities,
    tags,
    setsmaster,
    casesautomatestatus,
    casesstatus,
    casestypes,
    casesmaster,
    casestagslines,
    modules,
    foldersmaster,
    folders_folder_map_modules,
    setcaseslines,
    projectsmaster,
    companiesmaster,
    state,
    countries,
    casestypecases,
    casestemplates,
    stage_result
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
