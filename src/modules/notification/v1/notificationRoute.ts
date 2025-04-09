"use strict";

import { ResponseToolkit } from "@hapi/hapi";
import { failActionFunction } from "@utils/appUtils";
import { authorizationHeaderObj, headerObject } from "@utils/validator";
import { SWAGGER_DEFAULT_RESPONSE_MESSAGES, SERVER, PERMISSION, PERMISSION_TYPE } from "@config/index";
import { responseHandler } from "@utils/ResponseHandler";
import { notificationControllerV1 } from "..";
import {
  UpdateNotification,
  addNotification,
  clearNotification,
  notificationDetails,
  notificationList,
  readNotifications,
} from "./routeValidate";
import { subAdminControllerV1 } from "@modules/subAdmin";

export const notificationRoute = [
  {
    method: "POST",
    path: `${SERVER.API_BASE_URL}/v1/admin/notification`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.NOTIFICATIONS_MANAGEMENT, PERMISSION_TYPE.EDIT)

        const accessToken: string = request.headers.authorization;
        const payload: NotificationRequest.AddNotification = request.payload;
        const result = await notificationControllerV1.addNotification(
          payload,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Create New Notification from Admin",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: addNotification,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/notification`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.NOTIFICATIONS_MANAGEMENT, PERMISSION_TYPE.VIEW)


        const query: NotificationRequest.NotificationDetails = request.query;
        const accessToken: string = request.headers.authorization;

        const result = await notificationControllerV1.notificationDetails(
          query,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Notification Details",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: notificationDetails,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/notification-list`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const tokenData: TokenData =
          request.auth &&
          request.auth.credentials &&
          request.auth.credentials.tokenData;
        await subAdminControllerV1.hasPermissionAccess(tokenData.userId, PERMISSION.NOTIFICATIONS_MANAGEMENT, PERMISSION_TYPE.VIEW)

        const query: NotificationRequest.NotificationList = request.query;
        console.log("query", query);
        const accessToken: string = request.headers.authorization;

        const result = await notificationControllerV1.notificationListing(
          query,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Notification Listing",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: notificationList,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/notification`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const payload: NotificationRequest.UpdateNotification = request.payload;
        const accessToken: string = request.headers.authorization;

        const result = await notificationControllerV1.updateNotifications(
          payload,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Update Notification Details",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: UpdateNotification,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/received-notification-list`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const query: NotificationRequest.UserNotificationList = request.query;
        const accessToken: string = request.headers.authorization;

        const result = await notificationControllerV1.receivedNotificationListing(
          query,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Received Notifications Listing",
      auth: {
        strategies: ["UserAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        query: notificationList,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/read-notification`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const payload: NotificationRequest.ReadNotification = request.payload;
        const accessToken: string = request.headers.authorization;

        const result = await notificationControllerV1.readNotification(
          payload
          ,
          accessToken
        );
        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Mark notifications as read",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: readNotifications,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/clear-notification`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const accessToken: string = request.headers.authorization;
        const payload: NotificationRequest.ClearNotification = request.payload;
        const result = await notificationControllerV1.clearNotification(
          payload,
          accessToken
        );

        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Clear/Delete Notifications",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: clearNotification,
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
    path: `${SERVER.API_BASE_URL}/v1/admin/resend-notification`,
    handler: async (request: Request | any, h: ResponseToolkit) => {
      try {
        const accessToken: string = request.headers.authorization;
        const payload: NotificationRequest.ClearNotification = request.payload;
        const result = await notificationControllerV1.resendNotification(
          payload,
          accessToken
        );

        return responseHandler.sendSuccess(h, result);
      } catch (error) {
        return responseHandler.sendError(request, error);
      }
    },
    config: {
      tags: ["api", "notification"],
      description: "Resend Notification",
      auth: {
        strategies: ["AdminAuth"],
      },
      validate: {
        headers: authorizationHeaderObj,
        payload: clearNotification,
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
