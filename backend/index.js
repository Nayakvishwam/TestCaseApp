const { port } = require("./utils/utils");
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
var cors = require('cors');
const allRoutes = require("./routes/routes");
const { syncData } = require("./utils/SyncData");
const { filemanager } = require("./utils/filemanager");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(express.json());
app.use("/api", allRoutes);
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await syncData();
    filemanager.buildEnv();
});