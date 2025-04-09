"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER, PERMISSION, PERMISSION_TYPE } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { dashboardControllerV1 } from "..";
import { getDashboardDetails } from "./routeValidator";
import { subAdminControllerV1 } from "@modules/subAdmin";

export const dashboardRoute = [
    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/dashboard`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.DASHBOARD, PERMISSION_TYPE.VIEW)


                const accessToken: string = request.headers.authorization;
                const query: DashboardRequest.GetDetails = request.query;
                const result = await dashboardControllerV1.getDashboardDetails(query, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "dashboard"],
            description: "fetch dashboard details",
            auth: {
                strategies: ["AdminAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getDashboardDetails,
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
