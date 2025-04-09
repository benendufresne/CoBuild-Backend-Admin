"use strict";

import * as HapiSwagger from "hapi-swagger";
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";

import { SERVER } from "@config/environment";

// Register Swagger Plugin
export const plugin = {
	name: "swagger-plugin",
	register: async function (server) {
		const swaggerOptions = {
			info: {
				title: "Cobuild API Documentation",
				description: "Cobuild Admin API Documentation",
				contact: {
					name: "Harshit",
					email: "harshit.singh@appinventiv.com"
				},
				version: "1.0.0"
			},
			tags: [
				{
					name: "admin",
					description: "Operations about admin",

				},
				{
					name: "job",
					description: "Operations about job"
				},
				{
					name: "service",
					description: "Operations about service category and service type"
				},
				{
					name: "contents",
					description: "Operations about contents"
				},
			],
			grouping: "tags",
			schemes: [SERVER.PROTOCOL, 'https'],
			documentationPath: '/admin/documentation',
			jsonPath: '/admin/swagger.json',
			jsonRoutePath: '/admin/swagger.json',
			swaggerUIPath: '/admin/swaggerui/',
			routesBasePath: '/admin/swaggerui/',
			basePath: SERVER.API_BASE_URL,
			consumes: [
				"application/json",
				"application/x-www-form-urlencoded",
				"multipart/form-data"
			],
			produces: [
				"application/json"
			],
			securityDefinitions: {
				api_key: {
					type: "apiKey",
					name: "api_key",
					in: "header"
				}
			},
			security: [{
				api_key: []
			}]
		};

		await server.register([
			Inert,
			Vision,
			{
				plugin: HapiSwagger,
				options: swaggerOptions
			}
		]);
	}
};