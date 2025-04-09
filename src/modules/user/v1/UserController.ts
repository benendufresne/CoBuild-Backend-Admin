"use strict";

import * as _ from "lodash";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import * as promise from "bluebird";
import { buildToken, encryptHashPassword, genRandomString, getRandomOtp, matchOTP, matchPassword, passwordGenrator } from "@utils/appUtils";
import {
  DB_MODEL_REF,
  MAIL_TYPE,
  MESSAGES,
  SERVER,
  STATUS,
} from "@config/index";
import { axiosService } from "@lib/axiosService";
import { createObjectCsvWriter } from "csv-writer";
import { imageUtil } from "@lib/index";
import * as moment from 'moment';

export class UserController {

  constructor() {
  }

  /**
  * @function addUser
  * @description add user by admin
  * @param params.name: user's name (required)
  * @param params.countryCode: user's country code (required)
  * @param params.mobileNo: user's mobile number (required)
  * @param params.email: user's email (required)
  * @param params.address: user's address (required)
  */
  async addUser(params: UserRequest.AddUser, accessToken: string) {
    try {
      let data = await axiosService.post({ "url": SERVER.USER_APP_URL + SERVER.ADD_USER, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.ADD_USER(data.data);
    }
    catch (error) {
      throw error
    }
  }

  /**
    * @function userListing
    * @description get the listing of users
    * @param params.pageNo
    * @param params.limit
    * @returns array of users
    */
  async userListing(params: UserRequest.UserList, accessToken: string, tokenData: TokenData) {
    try {

      const isExport = params.isExport
      if (isExport) {
        params.limit = 200
        delete params.isExport
      }

      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.LIST_USER, "payload": params, auth: accessToken });

      if (isExport) {
        const includesBlockedReason = params.status?.includes(STATUS.BLOCKED) || false;
        const formattedData = data.data.map((item) => {
          const formattedItem: any = {
            name: item.name || "N/A",
            email: item.email || "N/A",
            mobileNo: item.countryCode + item.mobileNo || "N/A",
            address: item.location?.address || "N/A",
            status: item.status || "N/A",
            lastLogin: moment(item.lastLogin).format("HH:mm DD/MM/YY ") || "N/A",
            addedOn: moment(item.created).format("HH:mm DD/MM/YY ") || "N/A",
          };
          if (item.blockedReason) {
            formattedItem.blockedReason = item.blockedReason;
          }
          return formattedItem;
        });

        const fileName = `users_${Date.now()}.csv`;
        const exportUrl = await this.exportToCSV(formattedData, fileName, includesBlockedReason);

        let mailData = {
          type: MAIL_TYPE.EXPORT_USER_LIST,
          email: tokenData.email,
          link: `https://${exportUrl}`,
        };

        axiosService.postData({
          url: process.env.NOTIFICATION_APP_URL + SERVER.SEND_MAIL,
          body: mailData,
        });

        return MESSAGES.SUCCESS.USER_LIST_EXPORTED(exportUrl);
      }
      else {
        return MESSAGES.SUCCESS.USER_LIST(data);
      }
    }
    catch (error) {
      throw error
    }
  }

  /**
 * @function blockUnblock
 */
  async blockOrDeleteUser(params: UserRequest.blockDeleteUser, accessToken: string) {
    try {
      let data = await axiosService.post({ "url": SERVER.USER_APP_URL + SERVER.BLOCK_DELETE_USER, "body": params, auth: accessToken });
      console.log({ data })
      if (params.type == STATUS.BLOCKED)
        return MESSAGES.SUCCESS.USER_BLOCKED(data.data);
      else if (params.type == STATUS.DELETED)
        return MESSAGES.SUCCESS.USER_DELETED(data.data);
      else if (params.type == STATUS.UN_BLOCKED)
        return MESSAGES.SUCCESS.USER_UNBLOCKED(data.data);
      else
        return MESSAGES.SUCCESS.USER_DETAILS(data.data);
    }
    catch (error) {
      throw error
    }
  }

  /**
* @function userDetails
* @description get the details of user
*/
  async userDetails(params: UserId, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.USER_DETAILS, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.USER_DETAILS(data.data);
    }
    catch (error) {
      throw error
    }
  }


  /**
* @function editUser
* @description get the details of user
*/
  async editUser(params: UserRequest.EditUser, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.USER_APP_URL + SERVER.EDIT_USER, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.EDIT_USER(data.data);
    }
    catch (error) {
      throw error
    }
  }

  async exportToCSV(data: any[], fileName: string, includesBlockedReason: boolean) {
    const headers = [
      { id: "name", title: "Name" },
      { id: "mobileNo", title: "Mobile Number" },
      { id: "email", title: "Email" },
      { id: "addedOn", title: "Added On" },
      { id: "address", title: "Address" },
      { id: "lastLogin", title: "Last Login" },
      { id: "status", title: "Status" },
    ];

    // Add "blockedReason" header dynamically if it exists in the data
    if (includesBlockedReason) {
      headers.push({ id: "blockedReason", title: "Blocked Reason" });
    }

    const csvWriter = createObjectCsvWriter({
      path: `${SERVER.UPLOAD_DIR}${fileName}`,
      header: headers,
    });

    try {
      await csvWriter.writeRecords(data);
      const csv = await imageUtil.uploadSingleMediaToS3(fileName);
      return csv;
    } catch (error) {
      console.error("Error writing CSV:", error);
    }
  }



}

export const userController = new UserController();
