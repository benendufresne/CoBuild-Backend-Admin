"use strict";

import * as _ from "lodash";
import * as crypto from "crypto";
import * as mongoose from "mongoose";
import * as promise from "bluebird";
import { buildToken, encryptHashPassword, genRandomString, generatePassword, getRandomOtp, matchOTP, matchPassword, passwordGenrator } from "@utils/appUtils";
import {
    MESSAGES,
    STATUS,
    TOKEN_TYPE,
    SERVER,
    DB_MODEL_REF,
    ENVIRONMENT,
    MAIL_TYPE,
    REDIS_PREFIX,
    JOB_SCHEDULER_TYPE,
    USER_TYPE
} from "@config/index";

import { imageUtil, logger } from "@lib/index";
import { axiosService } from "@lib/axiosService";
import { createObjectCsvWriter } from "csv-writer";

const AWS = require("aws-sdk");
export class DashboardController {
    constructor() {
    }

    async getDashboardDetails(params: DashboardRequest.GetDetails, accessToken: string) {
        let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.DASHBOARD, "payload": params, auth: accessToken });
        const fileName = `dashboard_${Date.now()}.csv`;
        if (params.isExport) {
            const csvUrl = await this.exportToCSV(data.data, fileName)
            return MESSAGES.SUCCESS.DASHBOARD(csvUrl);
        }
        else {
            return MESSAGES.SUCCESS.DASHBOARD(data.data);
        }
    }

    async exportToCSV(data: any[], fileName: string) {
        const headers = [
            { id: "totalUsers", title: "Total Users" },
            { id: "activeUsers", title: "Active Users" },
            { id: "blockedUsers", title: "Blocked Users" },
            { id: "totalJobs", title: "Total Jobs" },
            { id: "activeJobs", title: "Active Jobs" },
            { id: "completedJobs", title: "Completed Jobs" },
            { id: "cancelledJobs", title: "Cancelled Jobs" },
        ];

        const csvWriter = createObjectCsvWriter({
            path: `${SERVER.UPLOAD_DIR}${fileName}`,
            header: headers,
        });

        try {
            const dataArray = [data];
            await csvWriter.writeRecords(dataArray);
            const csv = await imageUtil.uploadSingleMediaToS3(fileName);
            return csv;
        } catch (error) {
            console.error("Error writing CSV:", error);
        }
    }

}

export const dashboardController = new DashboardController();
