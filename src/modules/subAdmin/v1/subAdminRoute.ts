"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { subAdminControllerV1 } from "..";
import { addSubAdmin, createRole, editRole, editSubAdminDetails, getRoleDetails, getRolesListing, getSubAdminDetails, getSubAdminListing } from "./routeValidator";

export const subAdminRoute = [
    {
        method: "POST",
        path: `${SERVER.API_BASE_URL}/v1/admin/role`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const payload: SubAdminRequest.CreateRole = request.payload;
                const result = await subAdminControllerV1.createRoles(payload);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "create roles for sub admin",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                payload: createRole,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "PUT",
        path: `${SERVER.API_BASE_URL}/v1/admin/role`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                const accessToken: string = request.headers.authorization;
                const payload: SubAdminRequest.EditRole = request.payload;
                const result = await subAdminControllerV1.editRole(payload, tokenData, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "edit role",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                payload: editRole,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/role`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const query: SubAdminRequest.GetRoleDetails = request.query;
                const result = await subAdminControllerV1.getRoleDetails(query);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "fetch role details",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getRoleDetails,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/roles-list`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const query: SubAdminRequest.GetRolesListing = request.query;
                const result = await subAdminControllerV1.getRolesListing(query);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "fetch roles list for sub admin",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getRolesListing,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/roles-name-list`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const result = await subAdminControllerV1.getRolesNameList();
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "fetch role's name list for dropdown",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "POST",
        path: `${SERVER.API_BASE_URL}/v1/admin/sub-admin`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                const accessToken: string = request.headers.authorization;
                const payload: SubAdminRequest.AddSubAdmin = request.payload;
                const result = await subAdminControllerV1.addSubAdmin(payload, tokenData);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "add a sub admin",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                payload: addSubAdmin,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "PUT",
        path: `${SERVER.API_BASE_URL}/v1/admin/sub-admin`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                const accessToken: string = request.headers.authorization;

                const payload: SubAdminRequest.EditSubAdmin = request.payload;
                const result = await subAdminControllerV1.editSubAdmin(payload, tokenData, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "edit sub admin details",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                payload: editSubAdminDetails,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/sub-admin`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const query: SubAdminRequest.GetSubAdminDetails = request.query;
                const result = await subAdminControllerV1.getSubAdminDetails(query);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "fetch sub admin details",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getSubAdminDetails,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/sub-admin-list`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const query: SubAdminRequest.GetSubAdminList = request.query;
                const result = await subAdminControllerV1.subAdminList(query);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "subAdmin"],
            description: "fetch sub admin list",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getSubAdminListing,
                failAction: failActionFunction
            },
            plugins: {
                "hapi-swagger": {
                    responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
                }
            }
        }
    },
];
