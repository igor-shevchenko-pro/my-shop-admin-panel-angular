//Base WebSite URL
export const baseWebSiteUrl = "https://www.youtube.com";


// Base WebApi URL 
export const baseApiUrl = 'https://localhost:5001/api';
// Base FileWebApi URL 
export const baseFileStoreApiUrl = 'https://localhost:5003/api';


// Account
export const accountEndpoints = {
    login: baseApiUrl + "/account/authentication",
    changePassword: baseApiUrl + "/account/change_password",
    recoveryPasswordRequest: baseApiUrl + "/account/recovery_password_request",
    recoveryPassword: baseApiUrl + "/account/recovery_password",
};

// User
export const userEndpoints = {
    getCurrent: baseApiUrl + "/user/get_current_user",
    update: baseApiUrl + "/user/update",
    getById: baseApiUrl + "/user/get",
    add: baseApiUrl + "/user/add",
    getManagers: baseApiUrl + "/user/get_managers",
    delete: baseApiUrl + "/user/delete",
    changeActivityStatus: baseApiUrl + "/user/activity_status",
    setDefaultPhoto: baseApiUrl + "/user/set_default_photo",
};

// Role
export const roleEndpoints = {
    getAll: baseApiUrl + "/role/get_all",
    getAllWithNestedManagers: baseApiUrl + "/role/get_all_with_nested_managers",
    add: baseApiUrl + "/role/add",
    delete: baseApiUrl + "/role/delete",
    deleteRange: baseApiUrl + "/role/delete_range",
    update: baseApiUrl + "/role/update",
    changeActivityStatus: baseApiUrl + "/role/activity_status",
};

// File
export const fileEndpoints = {
    add: baseFileStoreApiUrl + "/file/add",
    delete: baseFileStoreApiUrl + "/file/delete",
    deleteRange: baseFileStoreApiUrl + "/file/delete_range",
    getData: baseFileStoreApiUrl + "/file/get_data/",
};

// Category
export const categoryEndpoints = {
    getAll: baseApiUrl + "/category/get_all",
    getById: baseApiUrl + "/category/get",
    add: baseApiUrl + "/category/add",
    update: baseApiUrl + "/category/update",
    delete: baseApiUrl + "/category/delete",
    changeActivityStatus: baseApiUrl + "/category/activity_status",
}

// ImageGallery
export const imageGalleryEndpoints = {
    add: baseApiUrl + "/imagegallery/add",
    update: baseApiUrl + "/imagegallery/update",
    getById: baseApiUrl + "/imagegallery/get",
    delete: baseApiUrl + "/imagegallery/delete",
}

// Brand
export const brandEndpoints = {
    getAll: baseApiUrl + "/brand/get_all",
    getById: baseApiUrl + "/brand/get",
    add: baseApiUrl + "/brand/add",
    update: baseApiUrl + "/brand/update",
    delete: baseApiUrl + "/brand/delete",
    changeActivityStatus: baseApiUrl + "/brand/activity_status",
}

// Supplier
export const supplierEndpoints = {
    getAll: baseApiUrl + "/supplier/get_all",
    getById: baseApiUrl + "/supplier/get",
    add: baseApiUrl + "/supplier/add",
    update: baseApiUrl + "/supplier/update",
    delete: baseApiUrl + "/supplier/delete",
    deleteRange: baseApiUrl + "/supplier/delete_range",
    changeActivityStatus: baseApiUrl + "/supplier/activity_status",
}