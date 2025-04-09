"use strict";

import { BaseDao } from "@modules/baseDao/BaseDao";
import { STATUS, DB_MODEL_REF } from "@config/constant";

import { createObjectCsvWriter } from "csv-writer";
import { imageUtil } from "@lib/ImageUtil";
import { SERVER } from "@config/index";
import { toObjectId } from "@utils/appUtils";

export class JobDao extends BaseDao {
  private serviceCategoryModel: any;

  constructor() {
    super();
    this.serviceCategoryModel = DB_MODEL_REF.SERVICE_CATEGORY;
  }

  async getCategoryDetails(categoryIdString: string) {
    try {
      const query: any = { categoryIdString }
      return await this.findOne(this.serviceCategoryModel, query);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



}

export const jobDao = new JobDao();
