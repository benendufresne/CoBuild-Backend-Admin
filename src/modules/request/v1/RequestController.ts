"use strict";

import * as _ from "lodash";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import * as promise from "bluebird";
import { buildToken, encryptHashPassword, genRandomString, getRandomOtp, matchOTP, matchPassword, passwordGenrator } from "@utils/appUtils";
import {
  MESSAGES,
  STATUS,
  TOKEN_TYPE,
  SERVER,
  DB_MODEL_REF,

} from "@config/index";
import { axiosService } from "@lib/axiosService";
const AWS = require("aws-sdk");
export class RequestController {
  private modelLoginHistory: any;
  private modelUser: any;
  constructor() {
    this.modelLoginHistory = DB_MODEL_REF.LOGIN_HISTORY;
    this.modelUser = DB_MODEL_REF.USER;
  }



  async getReqDetails(params: ReqRequest.GetReqDetails, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.REQUEST, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.GET_REQ_DETAILS(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async updateRequest(params: ReqRequest.UpdateReqDetails, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.USER_APP_URL + SERVER.REQUEST, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.UPDATE_REQ(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async requestList(params: ReqRequest.ReqList, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.REQUEST_LIST, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.GET_REQ_LIST(data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async acceptRequest(params: ReqRequest.AcceptRequest, accessToken: string) {
    try {

      let userData = await axiosService.getData({
        "url": SERVER.USER_APP_URL + SERVER.USER_DETAILS,
        "payload": { userId: params.userId },
        auth: accessToken
      });

      params.userName = userData.data.name
      if (userData.data.profilePicture) params.userProfilePicture = userData.data.profilePicture

      let data = await axiosService.post({ "url": SERVER.CHAT_APP_URL + SERVER.REQUEST_ACCEPTED, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.ACCEPT_REQUEST;
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

}

export const requestController = new RequestController();
