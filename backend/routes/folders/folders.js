const express = require("express");
const router = express.Router();
const { validator } = require("../../middelware/validators");
const {
    getFolders,
    createFolder,
    renameFolder,
    moveTo,
    deleteFolder } = require("../../controllers/folders/folders");
const { param, body } = require("express-validator");

router.get("/getfolders/:event",
    [
        param('event')
            .isInt().withMessage('Event must be an integer')
            .toInt()
    ],
    validator,
    getFolders
);
let getCreateRenameOrDeleteValidator = () => {
    return [
        param('event')
            .isInt().withMessage('Event must be an integer')
            .toInt(),
        body('name')
            .trim()
            .isString().withMessage('Name must be a string')
            .isLength({ min: 1 }).withMessage('Name cannot be empty'),
        body('folderId')
            .isInt().withMessage('Folder ID must be an integer')
            .toInt()
    ];
}
router.post("/createfolder/:event",
    getCreateRenameOrDeleteValidator(),
    validator,
    createFolder
);
router.put("/renamefolder/:event",
    getCreateRenameOrDeleteValidator(),
    validator,
    renameFolder
);
router.put("/moveTo/:event",
    getCreateRenameOrDeleteValidator(),
    validator,
    moveTo
);
router.delete("/deleteFolder/:id",
    [
        param('id')
            .isInt().withMessage('Folder ID must be an integer')
            .toInt()
    ],
    validator,
    deleteFolder
);
module.exports = router;