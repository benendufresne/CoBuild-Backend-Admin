"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER, PERMISSION, PERMISSION_TYPE } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { reportDamageControllerV1 } from "..";
import { createReport, getReportDetails, reportListing, updateReport } from "./routeValidator";
import { subAdminControllerV1 } from "@modules/subAdmin";

export const reportDamageRoute = [

    {
        method: "GET",
        path: `${SERVER.API_BASE_URL}/v1/admin/report-damage`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.INCIDENTS_DAMAGE, PERMISSION_TYPE.VIEW)

                const accessToken: string = request.headers.authorization;
                const payload: ReportDamageRequest.GetReportDetails = request.query;
                const result = await reportDamageControllerV1.getReportDetails(payload, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "report"],
            description: "get request details (User & Admin)",
            auth: {
                strategies: ["CommonAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: getReportDetails,
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
        path: `${SERVER.API_BASE_URL}/v1/admin/report-list`,
        handler: async (request: Request | any, h: ResponseToolkit) => {
            try {
                const tokenData: TokenData =
                    request.auth &&
                    request.auth.credentials &&
                    request.auth.credentials.tokenData;
                await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.INCIDENTS_DAMAGE, PERMISSION_TYPE.VIEW)

                const accessToken: string = request.headers.authorization;
                const payload: ReportDamageRequest.ReportListing = request.query;
                const result = await reportDamageControllerV1.getReportListing(payload, accessToken);
                return responseHandler.sendSuccess(h, result);
            } catch (error) {
                return responseHandler.sendError(request, error);
            }
        },
        config: {
            tags: ["api", "report"],
            description: "get report listing (User & Admin)",
            auth: {
                strategies: ["CommonAuth"]
            },
            validate: {
                headers: authorizationHeaderObj,
                query: reportListing,
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
        path: `${SERVER.API_BASE_URL}/v1/admin/report-damage`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.EDIT)

				const accessToken: string = request.headers.authorization;
				const payload: ReportDamageRequest.UpdateReport = request.payload;
				const result = await reportDamageControllerV1.updateReport(payload, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
            tags: ["api", "report"],
			description: "update report details from admin",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: updateReport,
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
