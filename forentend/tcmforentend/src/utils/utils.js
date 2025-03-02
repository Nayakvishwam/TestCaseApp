const isLocal = true

const apiUrl = isLocal ? "http://localhost:5170/api" : "";
export const apis = {
    Urls: {
        getCases: apiUrl + "/cases/getCases",
        createCase: apiUrl + "/cases/createCase",
        casesstatus: apiUrl + "/common/casesstatus/",
        casesautomationstatus: apiUrl + "/common/casesautomationstatus/",
        tags: apiUrl + "/common/tags/",
        priorities: apiUrl + "/common/priorities/",
        casestemplates: apiUrl + "/common/casestemplates/",
        casestypecases: apiUrl + "/common/casestypecases/",
        getfolders: apiUrl + "/folders/getfolders/",
        createfolder: apiUrl + "/folders/createfolder/",
        renamefolder: apiUrl + "/folders/renamefolder/",
        movefolder: apiUrl + "/folders/moveTo/",
        deleteFolder: apiUrl + "/folders/deleteFolder/",
        getSets: apiUrl + "/sets/getSets/",
        createSet: apiUrl + "/sets/createSet/",
        assigncases: apiUrl + "/sets/assigncases"
    }
};
export const buildPaginationUrl = ({ page, totalRecords, UrlKey }) => {
    let Url = apis.Urls[UrlKey];
    Url = Url + `?page=${page}&totalRecords=${totalRecords}`;
    return Url;
}
export const apiCaller = {
    passbody: async (params) => {
        return params.method != "GET" ? { body: JSON.stringify(params.body) } : {}
    },
    callapi: async (params) => {
        const body = await apiCaller.passbody(params);
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append('Content-Type', 'application/json');
        if (params.method == "GET" && params.headers) {
            Object.keys(params.headers).map(header => {
                headers.append(header, params.headers[header]);
            })
        }
        const response = await fetch(params.url, {
            method: params.method,
            headers: headers,
            ...body
        }).then((response) => response.json())
        return response;
    },
    get: async (params) => {
        params.method = "GET";
        const response = await apiCaller.callapi(params);
        return response;
    },
    post: async (params) => {
        params.method = "POST";
        const response = await apiCaller.callapi(params);
        return response;
    },
    delete: async (params) => {
        params.method = "DELETE";
        const response = await apiCaller.callapi(params);
        return response;
    },
    put: async (params) => {
        params.method = "PUT";
        const response = await apiCaller.callapi(params);
        return response;
    },
}

function Utils() {
    this.defaultPagination = {
        page: 1,
        totalRecords: 10
    };
    this.modules = {
        "Cases": 0,
        "Sets": 1,
        "Cycles": 2,
        "All": 3
    };
    this.MAX_FILE_SIZE = 50 * 1024 * 1024;
    this.getPagination = ({ currentPage, totalPages }) => {
        let pages = [];
        let different = totalPages - currentPage;
        if (different > 3) {
            pages.push(currentPage);
            currentPage++;
            pages.push(currentPage);
            currentPage++;
            pages.push(currentPage);
            currentPage++;
            pages.push('.');
            pages.push('.');
            pages.push(totalPages);
        } else {
            for (let index = currentPage; index <= totalPages; index++) {
                pages.push(index);
            }
        };
        return pages;
    }
}

export const exportutils = new Utils();