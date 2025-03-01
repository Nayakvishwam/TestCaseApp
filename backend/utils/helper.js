async function mapFolders(flatFolders, folderMappings) {
    let folderMap = new Map();
    let rootNodes = [];
    let folderTree = {};
    flatFolders.forEach(folder => {
        if (folder.name == "All") {
            folderTree = {
                id: folder.id,
                name: folder.name,
                children: []
            };
        }
        folderMap.set(folder.id, {
            id: folder.id,
            name: folder.name,
            children: []
        });
    });
    folderMappings.forEach(mapping => {
        if (folderMap.has(mapping.folderId) && folderMap.has(mapping.foldermapId)) {
            folderMap.get(mapping.folderId).children.push(folderMap.get(mapping.foldermapId));
        }
    });
    flatFolders.forEach(folder => {
        let isChild = folderMappings.some(mapping => mapping.foldermapId === folder.id);
        if (!isChild) {
            rootNodes.push(folderMap.get(folder.id));
        }
    });
    return rootNodes;
};

module.exports = {
    mapFolders
}