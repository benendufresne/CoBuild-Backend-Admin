"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER, PERMISSION, PERMISSION_TYPE } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { requestControllerV1 } from "..";
import { acceptRequest, createRequest, getRequestDetails, reqListing, updateRequest } from "./routeValidator";
import { subAdminControllerV1 } from "@modules/subAdmin";

export const requestRoute = [
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/request`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.REQUESTS_MANAGEMENT, PERMISSION_TYPE.VIEW)

                const accessToken: string = request.headers.authorization;
                const payload: ReqRequest.GetReqDetails = request.query;
                const result = await requestControllerV1.getReqDetails(payload, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "request"],
            description: "get request details (User & Admin)",
            auth: {
                strategies: ["CommonAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getRequestDetails,
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
        path: `${SERVER.API_BASE_URL}/v1/admin/request`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {

                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.REQUESTS_MANAGEMENT, PERMISSION_TYPE.EDIT)

                const accessToken: string = request.headers.authorization;
                const payload: ReqRequest.UpdateReqDetails = request.payload;
                const result = await requestControllerV1.updateRequest(payload, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "request"],
            description: "update requests (User & Admin)",
            auth: {
                strategies: ["CommonAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                payload: updateRequest,
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
        path: `${SERVER.API_BASE_URL}/v1/admin/request-list`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.REQUESTS_MANAGEMENT, PERMISSION_TYPE.VIEW)

                const accessToken: string = request.headers.authorization;
                const payload: ReqRequest.ReqList = request.query;
                const result = await requestControllerV1.requestList(payload, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "request"],
            description: "get request listing (User & Admin)",
            auth: {
                strategies: ["CommonAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: reqListing,
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
        path: `${SERVER.API_BASE_URL}/v1/admin/request-accepted`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const params: ReqRequest.AcceptRequest = request.payload;
                const accessToken: string = request.headers.authorization;
                const result = await requestControllerV1.acceptRequest(params, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "request"],
            description: "Accept Request",
            auth: {
                strategies: ["CommonAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                payload: acceptRequest,
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
