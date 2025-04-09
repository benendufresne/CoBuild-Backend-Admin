"use strict";

import { MESSAGES } from "@config/constant";
import { SERVER } from "@config/environment";
import { axiosService } from "@lib/axiosService";

export class NotificationController {

  /**
   * @function addNotification
   * @description function will add notification from admin
   */
  async addNotification(params: NotificationRequest.AddNotification, accessToken: string) {
    try {
      
      let data = await axiosService.post({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.ADD_NOTIFICATION(data.data);
    } catch (error) {
      throw error;
    }
  }

  /**
 * @function addNotification
 * @description function will add notification from admin
 */
  async notificationListing(params: NotificationRequest.NotificationList, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION_LIST, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.NOTIFICATION_LIST(data);

    } catch (error) {
      throw error;
    }
  }

  /**
* @function notificationDetails
* @description function will fetch notification details
*/
  async notificationDetails(params: NotificationRequest.NotificationDetails, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.NOTIFICATION_LIST(data);
    } catch (error) {
      throw error;
    }
  }

  /**
* @function updateNotifications
* @description function will update notification details
*/
  async updateNotifications(params: NotificationRequest.UpdateNotification, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.EDIT_NOTIFICATION(data.data);
    } catch (error) {
      throw error;
    }
  }


  async receivedNotificationListing(params: NotificationRequest.UserNotificationList, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.RECEIVED_NOTIFICATION_LIST, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.NOTIFICATION_LIST(data.data);
    } catch (error) {
      throw error;
    }
  }

  async readNotification(params: NotificationRequest.ReadNotification, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION_READ, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.READ_NOTIFICATION;
    } catch (error) {
      throw error;
    }
  }

  async clearNotification(params: NotificationRequest.ClearNotification, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION_CLEAR, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.CLEAR_NOTIFICATION;
    } catch (error) {
      throw error;
    }
  }

  async resendNotification(params: NotificationRequest.ClearNotification, accessToken: string) {
    try {
      let data = await axiosService.post({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.NOTIFICATION_RESEND, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.RESEND_NOTIFICATION;
    } catch (error) {
      throw error;
    }
  }

}

export const notificationController = new NotificationController();
