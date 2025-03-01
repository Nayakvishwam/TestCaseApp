const fs = require('fs');
const path = require('path');
const os = require("os");

function fileManager() {
    this.casesAttachesLocation = "casesattaches";
    this.companiesLogos = "companieslogos";
    this.casesattaches = "casesattaches";
    this.rootDir = "TCM";
    this.createNewDir = (filePath) => {
        if (!(this.resourceExists(filePath))) {
            fs.mkdirSync(filePath, { recursive: true });
        }
    };
    this.convertFileToAny = (Data, form) => {
        Data = Buffer.from(Data, form);
        return Data;
    };
    this.resourceExists = (location) => {
        return fs.existsSync(location);
    };
    this.readFile = (filePath, form) => {
        const fileData = fs.readFileSync(filePath);
        return fileData.toString(form);
    };
    this.removeDirSync = (path) => {
        if (fs.existsSync(path)) {
            fs.rmSync(path, { recursive: true, force: true });
            console.log(`Directory ${path} removed successfully.`);
        } else {
            console.log(`Directory ${path} does not exist.`);
        }
    };
    this.writeFile = (destination, Data) => {
        fs.writeFileSync(destination, Data);
    };
    this.getAllFilesWithData = (dirPath, form) => {
        const files = fs.readdirSync(dirPath);
        return files.map(file => {
            const filePath = path.join(dirPath, file);
            const fileData = fs.readFileSync(filePath, { encoding: form });

            return {
                fileName: file,
                base64Data: fileData
            };
        });
    };
    this.getPath = (forWhich) => {
        let getpath = path.join(this.storagePath, forWhich);
        return getpath;
    };
    this.removeAllFiles = (dirPath) => {
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file) => {
                const filePath = path.join(dirPath, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            });
        }
    };
    this.buildEnv = () => {
        let currentPath = this.getPath(this.casesAttachesLocation);
        this.createNewDir(currentPath);
        currentPath = this.getPath(this.companiesLogos);
        this.createNewDir(currentPath);
    };
    this.getDefaultFileStorage = () => {
        const osType = os.type();
        let fileStoragePath;
        if (osType === "Windows_NT") {
            fileStoragePath = path.join("C:", this.rootDir, "fileStorage");
        } else if (osType === "Linux") {
            fileStoragePath = path.join("/var", this.rootDir, "fileStorage");
        } else if (osType === "Darwin") {
            fileStoragePath = path.join("/Users", this.rootDir, os.userInfo().username, "fileStorage");
        } else {
            fileStoragePath = path.join(os.homedir(), this.rootDir, "fileStorage");
        };
        if (!fs.existsSync(fileStoragePath)) {
            fs.mkdirSync(fileStoragePath, { recursive: true });
        }
        return fileStoragePath;
    };
    this.storagePath = this.getDefaultFileStorage();
};

let filemanager = new fileManager();
module.exports = { filemanager };