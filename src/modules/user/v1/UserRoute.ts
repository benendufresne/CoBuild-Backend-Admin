"use strict";

import { Request, ResponseToolkit } from "@hapi/hapi";

import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER, PERMISSION, PERMISSION_TYPE } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import {
  addUser,
  blockDeleteUser,
  editUser,
  userDetail,
  userListing,
} from "./routeValidator";
import { userControllerV1 } from "..";
import { subAdminControllerV1 } from "@modules/subAdmin";

export const userRoute = [
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/v1/user/listing`,
    handler: async (request, h) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.USERS_MANAGEMENT, PERMISSION_TYPE.VIEW)

        let query: UserRequest.UserList = request.query;
        const accessToken: string = request.headers.authorization;
        let result = await userControllerV1.userListing(query, accessToken, tokenData);
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "user"],
      description: "user Listing",
      auth: {
        strategies: ["CommonAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: userListing,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES,
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/v1/user/block-delete`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.USERS_MANAGEMENT, PERMISSION_TYPE.EDIT)

        const accessToken: string = request.headers.authorization;
        const payload: UserRequest.blockDeleteUser = request.payload;
        const result = await userControllerV1.blockOrDeleteUser(
          payload,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    options: {
      tags: ["api", "user"],
      description: "User Block/Unblock or Delete By Admin",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: blockDeleteUser,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES,
        },
      },
    },
  },
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/v1/user/add-user`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.USERS_MANAGEMENT, PERMISSION_TYPE.EDIT)

        const accessToken: string = request.headers.authorization;
        const payload: UserRequest.AddUser = request.payload;
        const result = await userControllerV1.addUser(payload, accessToken);
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "user"],
      description: "Add User By Admin",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: addUser,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES,
        },
      },
    },
  },
  {
    method: "GET",
    path: `${SERVER.API_BASE_URL}/v1/user/user-details`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.USERS_MANAGEMENT, PERMISSION_TYPE.VIEW)

        const accessToken: string = request.headers.authorization;
        const query: UserId = request.query;
        const result = await userControllerV1.userDetails(query, accessToken);
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "user"],
      description: "User Details",
      auth: {
        strategies: ["CommonAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: userDetail,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES,
        },
      },
    },
  },
  {
    method: "PUT",
    path: `${SERVER.API_BASE_URL}/v1/user/edit-user`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.USERS_MANAGEMENT, PERMISSION_TYPE.EDIT)

        const accessToken: string = request.headers.authorization;
        const payload: UserRequest.EditUser = request.payload;
        const result = await userControllerV1.editUser(payload, accessToken);
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "user"],
      description: "Edit user by Admin",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: editUser,
        failAction: failActionFunction,
      },
      plugins: {
        "hapi-swagger": {
          responseMessages: SWAGGER_DEFAULT_RESPONSE_MESSAGES,
        },
      },
    },
  },
];
