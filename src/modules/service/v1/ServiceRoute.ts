"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { editServiceCategory, editServiceType, getServiceCategory, getServiceCategoryListing, getServiceIdList, getServiceType, getServiceTypeIdListing, getServiceTypeListing, serviceCategory, serviceType } from "./routeValidator";
import { serviceControllerV1 } from "..";

export const serviceRoute = [
	{
		method: "POST",
		path: `${SERVER.API_BASE_URL}/v1/admin/service-category`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: ServiceRequest.CreateServiceCategory = request.payload;
				const result = await serviceControllerV1.createServiceCategory(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "create service category ",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: serviceCategory,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-category`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: ServiceRequest.EditServiceCategory = request.payload;
				const accessToken: string = request.headers.authorization;
				const result = await serviceControllerV1.editServiceCategory(payload, accessToken);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "edit service category",
			auth: {
				strategies: ["CommonAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: editServiceCategory,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-category`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query: ServiceRequest.GetServiceCategory = request.query;
				const result = await serviceControllerV1.getServiceCategory(query);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "fetch service details",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getServiceCategory,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-type`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: ServiceRequest.CreateServiceType = request.payload;
				const result = await serviceControllerV1.createServiceType(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "create service type ",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: serviceType,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-type`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const payload: ServiceRequest.EditServiceType = request.payload;
				const result = await serviceControllerV1.editServiceType(payload);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "edit service type",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				payload: editServiceType,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-type`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query: ServiceRequest.GetServiceType = request.query;
				const result = await serviceControllerV1.getServiceType(query);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "fetch service details",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getServiceType,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-category-list`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query: ServiceRequest.GetServiceCategoryListing = request.query;
				const result = await serviceControllerV1.getServiceCategoryListing(query);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "fetch services list",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getServiceCategoryListing,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-category-dropdown-list`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query: ServiceRequest.ServiceIdList = request.query;

				const result = await serviceControllerV1.getServiceCategoryDropdownList(query);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "fetch services category list (for dropdown list)",
			auth: {
				strategies: ["CommonAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getServiceIdList,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-typeId-list`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query: ServiceRequest.GetServiceTypeListing = request.query;
				const result = await serviceControllerV1.getServiceTypeDropdownList(query);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "fetch services type list (for dropdown list)",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getServiceTypeIdListing,
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
		path: `${SERVER.API_BASE_URL}/v1/admin/service-type-list`,
		handler: async (request: Request | any, h: ResponseToolkit) => {
			try {
				const query: ServiceRequest.GetServiceTypeListing = request.query;
				const result = await serviceControllerV1.getServiceTypeListing(query);
				return responseHandler.sendSuccess(h, result);
			} catch (error) {
				return responseHandler.sendError(request, error);
			}
		},
		config: {
			tags: ["api", "service"],
			description: "fetch services type list",
			auth: {
				strategies: ["AdminAuth"]
			},
			validate: {
				headers: authorizationHeaderObj,
				query: getServiceTypeListing,
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
