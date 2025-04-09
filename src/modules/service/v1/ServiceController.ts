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
  ENVIRONMENT,
  MAIL_TYPE,
  REDIS_PREFIX,
  JOB_SCHEDULER_TYPE,
  USER_TYPE
} from "@config/index";
import { baseDao } from "@modules/baseDao/index";
import { loginHistoryDao } from "@modules/loginHistory/index";
import { redisClient } from "@lib/redis/RedisClient";
import { sendMessageToFlock } from "@utils/FlockUtils";
import { logger } from "@lib/index";
import { axiosService } from "@lib/axiosService";
import { count } from "console";
import { serviceDaoV1 } from "..";
const AWS = require("aws-sdk");
export class ServiceController {
  private modelLoginHistory: any;
  private modelUser: any;
  constructor() {
    this.modelLoginHistory = DB_MODEL_REF.LOGIN_HISTORY;
    this.modelUser = DB_MODEL_REF.USER;
  }

  async createServiceCategory(params: ServiceRequest.CreateServiceCategory) {
    try {
      // const isExist = await serviceDaoV1.serviceCategoryExists(params);
      // if (isExist) return Promise.reject(MESSAGES.ERROR.SERVICE_CATEGORY_ALREADY_EXIST);

      params.categoryIdString = `CB${getRandomOtp(6)}`
      const serviceCategory = await serviceDaoV1.createServiceCategory(params);
      return MESSAGES.SUCCESS.ADD_SERVICE_CATEGORY(serviceCategory);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async getServiceCategory(params: ServiceRequest.GetServiceCategory) {
    try {
      const serviceCategory = await serviceDaoV1.getServiceCategory({ _id: params.categoryId });
      if (!serviceCategory) await Promise.reject(MESSAGES.ERROR.SERVICE_CATEGORY_NOT_FOUND);
      return MESSAGES.SUCCESS.GET_SERVICE_CATEGORY(serviceCategory);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async editServiceCategory(params: ServiceRequest.EditServiceCategory, accessToken: string) {
    try {
      console.log("helosdlfhaskfhsd")
      const isExist = await serviceDaoV1.getServiceCategory({ _id: params.categoryId });
      if (!isExist) await Promise.reject(MESSAGES.ERROR.SERVICE_CATEGORY_NOT_FOUND);
      const promises = [];
      if (params.status == STATUS.DELETED || params.status == STATUS.BLOCKED) {
        promises.push(axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.JOB_BY_CATEGORY, "payload": { categoryId: params.categoryId }, auth: accessToken }));
        promises.push(axiosService.getData({ "url": SERVER.USER_APP_URL + SERVER.REQUEST_LIST_BY_CATEGORY, "payload": { categoryId: params.categoryId }, auth: accessToken }));
        const [jobs, estimates] = await Promise.all(promises);
        console.log({ jobs, estimates })
        if (jobs.data.length > 0)
          await Promise.reject(MESSAGES.ERROR.JOBS_ASSOCIATED)
        if (estimates.data.length > 0)
          await Promise.reject(MESSAGES.ERROR.REQ_ASSOCIATED)
      }
      const serviceCategory = await serviceDaoV1.editServiceCategory({ _id: params.categoryId }, params);
      return MESSAGES.SUCCESS.EDIT_SERVICE_CATEGORY(serviceCategory);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getServiceCategoryListing(params: ServiceRequest.GetServiceCategoryListing) {
    try {
      const serviceCategoryList = await serviceDaoV1.getServiceCategoryListing(params);
      return MESSAGES.SUCCESS.GET_SERVICE_CATEGORY_LIST(serviceCategoryList);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getServiceCategoryDropdownList(params: ServiceRequest.ServiceIdList) {
    try {
      const serviceCategory = await serviceDaoV1.getServiceCategoryListingDropdown(params);
      return MESSAGES.SUCCESS.GET_SERVICE_CATEGORY_DROPDOWN(serviceCategory);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async createServiceType(params: ServiceRequest.CreateServiceType) {
    try {
      const serviceCategory = await serviceDaoV1.getServiceCategory({ _id: params.categoryId });
      if (!serviceCategory) await Promise.reject(MESSAGES.ERROR.SERVICE_CATEGORY_NOT_FOUND);
      params.categoryName = serviceCategory.name;
      params.serviceIdString = `CB${getRandomOtp(6)}`;
      const serviceType = await serviceDaoV1.createServiceType(params);
      return MESSAGES.SUCCESS.ADD_SERVICE_TYPE(serviceType);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async editServiceType(params: ServiceRequest.EditServiceType) {
    try {
      const isExist = await serviceDaoV1.getServiceType({ _id: params.serviceId });
      if (!isExist) await Promise.reject(MESSAGES.ERROR.SERVICE_TYPE_NOT_FOUND);
      const serviceType = await serviceDaoV1.editServiceType({ _id: params.serviceId }, params);
      return MESSAGES.SUCCESS.EDIT_SERVICE_TYPE(serviceType);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }


  async getServiceType(params: ServiceRequest.GetServiceType) {
    try {
      const serviceType = await serviceDaoV1.getServiceType({ _id: params.serviceId });
      if (!serviceType) await Promise.reject(MESSAGES.ERROR.SERVICE_TYPE_NOT_FOUND);
      return MESSAGES.SUCCESS.GET_SERVICE_TYPE(serviceType);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getServiceTypeDropdownList(params) {
    try {
      const serviceTypes = await serviceDaoV1.getServiceTypeDropdown(params);
      return MESSAGES.SUCCESS.GET_SERVICE_CATEGORY_DROPDOWN(serviceTypes);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getServiceTypeListing(params: ServiceRequest.GetServiceTypeListing) {
    try {
      const serviceTypeList = await serviceDaoV1.getServiceTypeListing(params);
      return MESSAGES.SUCCESS.GET_SERVICE_TYPE_LIST(serviceTypeList);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }


}

export const serviceController = new ServiceController();
