module.exports = {
    issues: {
        getIssue: (issueId) => `/rest/api/2/issue/${issueId}`,
        createIssue: "/rest/api/2/issue",
        updateIssue: (issueId) => `/rest/api/2/issue/${issueId}`,
        deleteIssue: (issueId) => `/rest/api/2/issue/${issueId}`
    },
    users: {
        getAllUsers: "/rest/api/2/user/search",
        getUserById: (key) => `/rest/api/2/user?key=${key}`
    },
    projects: {
        getAllProjects: "/rest/api/2/project",
        getProjectById: (projectId) => `/rest/api/2/project/${projectId}`
    }
}