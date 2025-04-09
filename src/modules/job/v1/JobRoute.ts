"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER, PERMISSION, PERMISSION_TYPE } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { createJob, getJob, importJob, jobListing, scheduleJob, updateJob, upload } from "./routeValidator";
import { jobControllerV1 } from "..";
import { subAdminControllerV1 } from "@modules/subAdmin";
import { imageUtil } from "@lib/ImageUtil";

export const jobRoute = [
	{
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/admin/job`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.EDIT)

				const accessToken: string = request.headers.authorization;
				const payload: JobRequest.CreateJob = request.payload;
				const result = await jobControllerV1.createJob(payload, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "create new job from admin",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: createJob,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/job`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.EDIT)

				const accessToken: string = request.headers.authorization;
				const payload: JobRequest.UpdateJob = request.payload;
				const result = await jobControllerV1.updateJobDetails(payload, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "update job details from admin",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: updateJob,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/job`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.VIEW)

				const accessToken: string = request.headers.authorization;
				const query: JobRequest.GetJob = request.query;
				const result = await jobControllerV1.getJobDetails(query, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "fetch job details from admin",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getJob,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/job-list`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;

				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.VIEW)

				const accessToken: string = request.headers.authorization;
				const query: JobRequest.JobList = request.query;
				console.log("query", query);
				const result = await jobControllerV1.getJobList(query, tokenData, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "fetch job list from admin",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: jobListing,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/jobId-dropdown-list`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.VIEW)

				const accessToken: string = request.headers.authorization;
				const result = await jobControllerV1.getJobIdDropdownList(accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "fetch jobId dropdown list from admin",
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
		path: `${SERVER.API_BASE_URL}/v1/admin/schedule-job`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {

				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.EDIT)

				const accessToken: string = request.headers.authorization;
				const payload: JobRequest.scheduleJob = request.payload;
				const result = await jobControllerV1.scheduleJob(payload, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "schedule job from admin",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: scheduleJob,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/import-jobs`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {

				const tokenData: TokenData =
					request.auth &&
					request.auth.credentials &&
					request.auth.credentials.tokenData;
				await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.JOB_MANAGEMENT, PERMISSION_TYPE.EDIT)

				const accessToken: string = request.headers.authorization;
				const payload = request.payload;
				console.log({payload})
				const result = await jobControllerV1.importJobs(payload, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "job"],
			description: "import jobs from CSV",
			auth: {
				strategies: ["AdminAuth"]
			},
			payload: {
				maxBytes: 1000 * 1000 * 500,
				output: "stream",
				allow: "multipart/form-data", // important
				parse: true,
				timeout: false,
				multipart: true // <-- this fixed the media type error
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: upload,
				failAction: failActionFunction
			},
			plugins: {
				"hapi-swagger": {
					payloadType: "form",
					responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
				}
			}
		}
	},
	// {
	// 	method: 'POST',
	// 	path: `${SERVER.API_BASE_URL}/v1/common/media-upload`,
	// 	handler: async (request: Request | any, h: ResponseToolkit) => { //NOSONAR
	// 		try {
	// 			const payload = request.payload;
	// 			console.log({ payload })
	// 			// const result = { "image": await imageUtil.uploadSingleMediaToS3(payload.file) };
	// 			// return responseHandler.sendSuccess(request,h, result);
	// 		} catch (error) {
	// 			return responseHandler.sendError(request, error);
	// 		}
	// 	},
	// 	config: {
	// 		tags: ["api", "common"],
	// 		description: "Media Upload multipart/form-data",
	// 		auth: {
	// 			strategies: ["BasicAuth"]
	// 		},
	// 		payload: {
	// 			maxBytes: 1000 * 1000 * 500,
	// 			output: "stream",
	// 			allow: "multipart/form-data", // important
	// 			parse: true,
	// 			timeout: false,
	// 			multipart: true // <-- this fixed the media type error
	// 		},
	// 		validate: {
	// 			payload: upload,
	// 			failAction: failActionFunction
	// 		},
			// plugins: {
			// 	"hapi-swagger": {
			// 		payloadType: "form",
			// 		responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES
			// 	}
			// }
	// 	}
	// }
];
