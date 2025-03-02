import { apiCaller, apis, buildPaginationUrl } from "../../../utils/utils";

export async function getCases({ params, payload }) {
    let Url = buildPaginationUrl({
        UrlKey: "getCases",
        page: params.page,
        totalRecords: params.totalRecords
    });
    return await apiCaller.post({
        url: Url,
        body: { filters: payload }
    });
}

export async function createCase(payload) {
    return await apiCaller.post({
        url: apis.Urls.createCase,
        body: payload
    })
};

export async function casesStatus() {
    return await apiCaller.get({
        url: apis.Urls.casesstatus
    })
};

export async function casesAutomationStatus() {
    return await apiCaller.get({
        url: apis.Urls.casesautomationstatus
    })
};

export async function getTags() {
    return await apiCaller.get({
        url: apis.Urls.tags
    })
};

export async function getPriorities() {
    return await apiCaller.get({
        url: apis.Urls.priorities
    })
};

export async function getCasesTemplates() {
    return await apiCaller.get({
        url: apis.Urls.casestemplates
    })
};

export async function getCasesTypeCases() {
    return await apiCaller.get({
        url: apis.Urls.casestypecases
    })
};