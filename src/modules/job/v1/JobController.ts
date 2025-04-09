"use strict";

import * as _ from "lodash";
import {
  JOB_TYPE,
  MAIL_TYPE,
  MESSAGES,
  SERVER,
  STATUS,
} from "@config/index";

import { imageUtil, } from "@lib/index";
import { axiosService } from "@lib/axiosService";
import { createObjectCsvWriter } from "csv-writer";
import * as path from "path";
import * as fs from "fs";
import * as csvParser from "csv-parser";
import { jobDaoV1 } from "..";
import { getLatLng, getRandomOtp, qrCodeBufferGenerator } from "@utils/appUtils";
const AWS = require("aws-sdk");
import { pipeline } from "stream";
import { promisify } from "util";
import * as moment from "moment";


export class JobController {

  constructor() {

  }

  async createJob(params: JobRequest.CreateJob, accessToken: string) {
    try {
      let data = await axiosService.post({ "url": SERVER.USER_APP_URL + SERVER.JOB, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.CREATE_JOB(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async getJobDetails(params: JobRequest.GetJob, accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.JOB, "payload": params, auth: accessToken });
      return MESSAGES.SUCCESS.JOB_DETAILS(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async updateJobDetails(params: JobRequest.UpdateJob, accessToken: string) {
    try {
      let data = await axiosService.putData({ "url": SERVER.USER_APP_URL + SERVER.JOB, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.UPDATE_JOB(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }
  async getJobList(params: JobRequest.JobList, tokenData: TokenData, accessToken: string) {
    try {
      const isExport = params.isExport;
      if (params.isExport) {
        delete params.isExport;
        params.pageNo = 1;
        params.limit = 1000;
      }
      if (params.exportTemplate) {
        const templateUrl = "https://cobuild-media.appskeeper.in/jobTemplate.csv"
        return MESSAGES.SUCCESS.JOB_TEMPLATE(templateUrl);
      } else {
        let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.JOB_LIST, "payload": params, auth: accessToken });
        if (isExport) {
          if (data.data.length == 0)
            await Promise.reject(MESSAGES.ERROR.JOB_LIST_EMPTY);
          const fileName = `jobs_${Date.now()}.csv`;
          const exportUrl = await this.exportToCSV(data.data, fileName);

          let mailData = {
            type: MAIL_TYPE.EXPORT_JOB_LIST,
            email: tokenData.email,
            link: `https://${exportUrl}`,
          };

          axiosService.postData({
            url: process.env.NOTIFICATION_APP_URL + SERVER.SEND_MAIL,
            body: mailData,
          });
          return MESSAGES.SUCCESS.JOB_LIST_EXPORTED(exportUrl);
        }
        else {
          return MESSAGES.SUCCESS.GET_JOB_LIST(data);
        }
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async getJobIdDropdownList(accessToken: string) {
    try {
      let data = await axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.JOBID_DROPDOWN_LIST, auth: accessToken });
      return MESSAGES.SUCCESS.GET_JOB_LIST(data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }


  async scheduleJob(params: JobRequest.scheduleJob, accessToken: string) {
    try {
      let data = await axiosService.post({ "url": SERVER.USER_APP_URL + SERVER.SCHEDULE_JOB, "body": params, auth: accessToken });
      return MESSAGES.SUCCESS.SCHEDULE_JOB(data.data);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }


  async exportToCSV(data: any[], fileName: string) {
    const headers = [
      { id: "jobIdString", title: "Job ID" },
      { id: "title", title: "Job Title" },
      { id: "categoryName", title: "Service Category" },
      { id: "companyAddress", title: "Company Address" }, // Updated key
      { id: "jobAddress", title: "Job Location" }, // Updated key
      { id: "schedule", title: "Scheduled Date & Time" },
      { id: "priority", title: "Priority Level" },
      { id: "status", title: "Status" },
    ];
  
    console.log("Raw Data:", data);
  
    const formattedData = data.map((item) => ({
      jobIdString: item.jobIdString || "N/A" ,
      title: item.title || "N/A" ,
      categoryName: item.categoryName || "N/A",
      companyAddress: item.companyLocation?.address || "N/A", // Extract the nested key
      jobAddress: item.location?.address || "N/A", // Extract the nested key
      schedule: item.schedule ? moment(item.schedule).format("YYYY-MM-DD HH:mm:ss") : "N/A",
      priority: item.priority || "N/A",
      status: item.status || "N/A",
    }));
  
    console.log("Formatted Data:", formattedData);
  
    const csvWriter = createObjectCsvWriter({
      path: `${SERVER.UPLOAD_DIR}${fileName}`,
      header: headers,
    });
  
    try {
      await csvWriter.writeRecords(formattedData);
      const csv = await imageUtil.uploadSingleMediaToS3(fileName);
      return csv;
    } catch (error) {
      console.error("Error writing CSV:", error);
    }
  }
  
  async importJobs(params: any, accessToken: string) {
    try {
      console.log({ params });
      const file = params.file;
      const timestamp = Date.now();
      const originalFilename = file.hapi.filename;
      const ext = path.extname(originalFilename);
      const fileName = `${timestamp}${ext}`;
      const filePath = path.join(process.cwd(), "src", "uploads", fileName);
      const pump = promisify(pipeline);

      const fileStream = fs.createWriteStream(filePath);
      await pump(file, fileStream);

      const headerMapping: Record<string, string> = {
        "JOB TITLE": "title",
        "SERVICE TYPE": "categoryName",
        "CATGEORY ID": "categoryIdString",
        "PERSONAL NAME": "personalName",
        "EMAIL": "email",
        "MOBILE NO": "fullMobileNo",
        "PRIORITY": "priority",
        "PROCEDURE": "procedure",
        "ADDRESS": "address",
        "CITY": "city",
        "ZIPCODE": "zipcode",
        "ABOUT COMPANY": "aboutCompany",
        "COMPANY ADDRESS": "companyAddress",
        "COMPANY CITY": "companyCity",
      };

      return new Promise((resolve, reject) => {
        let results: any[] = [];

        const stream = fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (row) => {
            try {
              const formattedRow = Object.fromEntries(
                Object.entries(row).map(([key, value]) => {
                  const newKey = headerMapping[key];
                  if (newKey === undefined) {
                    throw new Error(`Invalid CSV Header: ${key}`);
                  }
                  return [newKey, value];
                })
              );
              results.push(formattedRow);
            } catch (error) {
              stream.destroy(); // Stop further processing
              reject(error); // Reject the promise with the error
            }
          })
          .on("end", async () => {
            try {
              results = await Promise.all(
                results.map(async (job) => {
                  job.status = JOB_TYPE.SCHEDULED
                  job.created = Date.now();
                  job.priority = job.priority.toUpperCase();

                  job.jobIdString = `CB${getRandomOtp(6)}`;
                  const deepLink = `${SERVER.DEEPLINK_URL}jobId=${job.jobIdString}`;
                  const doorTag = deepLink
                  console.log({doorTag})
                  const qrBuffer = await qrCodeBufferGenerator(doorTag);
                  const qrUrl = await imageUtil.uploadToS3(`${job.jobIdString}.png`, qrBuffer, "image/png");
                  job.doorTag = `https://${SERVER.S3.FILE_BUCKET_URL}/exportFiles/${job.jobIdString}.png`;

                  if (job.categoryIdString) {
                    const category = await jobDaoV1.getCategoryDetails(job.categoryIdString);
                    if (!category) {
                      throw new Error(`Category not found for ID: ${job.categoryIdString}`);
                    }
                    // if(job.categoryName != category.name){
                    //   throw new Error(`CategoryName or Category ID does not match: ${job.categoryIdString}`);
                    // }
                    job.categoryId = category._id.toString();
                  }

                  if (job.address && job.city) {
                    const jobAddress = `${job.address}, ${job.city}`;
                    const details = await getLatLng(jobAddress);
                    job["location"] = {
                      coordinates: [details.longitude, details.latitude],
                      address: jobAddress,
                      type: "point",
                    };
                    delete job.address;
                    delete job.city;
                    delete job.zipcode;
                  }

                  if (job.companyAddress && job.companyCity) {
                    const jobCompanyAddress = `${job.companyAddress}, ${job.companyCity}`;
                    const details = await getLatLng(jobCompanyAddress);
                    job["companyLocation"] = {
                      coordinates: [details.longitude, details.latitude],
                      address: jobCompanyAddress,
                      type: "point",
                    };
                    delete job.companyAddress;
                    delete job.companyCity;
                  }

                  return job;
                })
              );

              await axiosService.post({
                url: SERVER.USER_APP_URL + SERVER.IMPORT_JOB,
                body: { jobs: results },
                auth: accessToken,
              });

              fs.unlink(filePath, (err) => {
                if (err) console.error("File deletion error:", err);
                else console.log("File deleted successfully:", filePath);
              });

              resolve(MESSAGES.SUCCESS.JOB_IMPORT);
            } catch (error) {
              reject(error);
            }
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    } catch (error) {
      console.error("Error processing CSV:", error);
      throw error;
    }
  }



}

export const jobController = new JobController();
