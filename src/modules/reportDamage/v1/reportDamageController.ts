"use strict";

import * as _ from "lodash";

import {
  MESSAGES,
  SERVER,

} from "@config/index";

import { axiosService } from "@lib/axiosService";
const AWS = require("aws-sdk");

export class ReportDamageController {

  constructor() {
  }


  async getReportDetails(params: ReportDamageRequest.GetReportDetails, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.REPORT_DAMAGES, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.REPORT_DETAILS(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }


  async getReportListing(params: ReportDamageRequest.ReportListing, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.REPORT_DAMAGES_LIST, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.REPORT_LIST(data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async updateReport(params: ReportDamageRequest.UpdateReport, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.USER_APP_URL + SERVER.REPORT_DAMAGES, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.REPORT_UPDATE(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

}

export const reportDamageController = new ReportDamageController();
