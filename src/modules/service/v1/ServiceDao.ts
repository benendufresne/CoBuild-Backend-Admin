"use strict";

import { BaseDao } from "@modules/baseDao/BaseDao";
import { STATUS, DB_MODEL_REF, SERVICE_TYPE } from "@config/constant";

import { createObjectCsvWriter } from "csv-writer";
import { imageUtil } from "@lib/ImageUtil";
import { SERVER } from "@config/index";
import { toObjectId } from "@utils/appUtils";

export class ServiceDao extends BaseDao {

  private serviceCategoryModel: any;
  private serviceTypeModel: any;
  constructor() {
    super();
    this.serviceCategoryModel = DB_MODEL_REF.SERVICE_CATEGORY;
    this.serviceTypeModel = DB_MODEL_REF.SERVICE_TYPE;

  }

  
  async createServiceCategory(params) {
    try {
      return await this.save(this.serviceCategoryModel, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getServiceCategory(params) {
    try {
      params.status = { $ne: STATUS.DELETED };
      return await this.findOne(this.serviceCategoryModel, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async serviceCategoryExists(params) {
    try {
      const query: any = {}
      query.status = { $ne: STATUS.DELETED }
      if (params.issueTypeName) {
        query.categoryName = { $regex: new RegExp(`^${params.categoryName}$`, 'i') };
        query.issueTypeName = { $regex: new RegExp(`^${params.issueTypeName}$`, 'i') };
      }
      return await this.findOne(this.serviceCategoryModel, query);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async editServiceCategory(query, params) {
    try {
      query.status = { $ne: STATUS.DELETED };
      return await this.findOneAndUpdate(this.serviceCategoryModel, query, params, { new: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createServiceType(params) {
    try {
      return await this.save(this.serviceTypeModel, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async editServiceType(query, params) {
    try {
      return await this.findOneAndUpdate(this.serviceTypeModel, query, params, { new: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getServiceType(params) {
    try {
      return await this.findOne(this.serviceTypeModel, params);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getServiceCategoryDropdown(params: ServiceRequest.ServiceIdList) {
    try {
      const filter = {
        status: { $ne: STATUS.DELETED }
      }
      if (params.searchKey) {
        filter["$or"] = [
          { name: { $regex: new RegExp(params.searchKey, "i") } },
          { categoryIdString: { $regex: new RegExp(params.searchKey, "i") } },
        ];
      }
      return await this.find(this.serviceCategoryModel, filter, { _id: 1, name: 1, categoryIdString: 1, serviceType: 1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getServiceTypeDropdown(params) {
    try {
      const filter = {
        status: { $ne: STATUS.DELETED }
      }
      if (params.categoryId) filter['categoryId'] = params.categoryId

      return await this.find(this.serviceTypeModel, filter, { _id: 1, name: 1, serviceIdString: 1 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getServiceCategoryListingDropdown(params: ServiceRequest.ServiceIdList) {
    try {
      const aggPipe = [];

      const match: any = {
        status: { $ne: STATUS.DELETED },
      };

      if (params.serviceType === SERVICE_TYPE.CATEGORY_SERVICE) {
        match.serviceType = SERVICE_TYPE.CATEGORY_SERVICE;

        if (params.searchKey) {
          match["$or"] = [
            { categoryName: { $regex: new RegExp(params.searchKey, "i") } },
          ];
        }

        aggPipe.push({ $match: match });

        const project: any = {
          _id: 1,
          categoryIdString: 1,
          serviceType: 1,
          categoryName: 1,
          issueTypeName: 1,
          subIssueName: 1,
          status: 1,
          created: 1,
        };

        aggPipe.push({ $project: project });
      } else if (params.serviceType === SERVICE_TYPE.CABLE_CONSULTING_SERVICE) {
        match.serviceType = SERVICE_TYPE.CABLE_CONSULTING_SERVICE;

        aggPipe.push({ $match: match });

        aggPipe.push({
          $group: {
            _id: {
              categoryName: "$categoryName",
              issueTypeName: "$issueTypeName",
            },
            subIssueNames: { $push: "$subIssueName" },
          },
        });

        aggPipe.push({
          $group: {
            _id: "$_id.categoryName",
            issueTypeNames: {
              $push: {
                issueTypeName: "$_id.issueTypeName",
                subIssueNames: { $arrayElemAt: ["$subIssueNames", 0] },
              },
            },
          },
        });

        aggPipe.push({
          $project: {
            _id: 0,
            categoryName: "$_id",
            issueTypeNames: 1,
          },
        });
      }

      return await this.aggregate(this.serviceCategoryModel, aggPipe);
    } catch (error) {
      throw error;
    }
  }



  async getServiceCategoryListing(params: ServiceRequest.GetServiceCategoryListing) {
    try {
      let { pageNo, limit, searchKey, sortBy, sortOrder } = params;
      const aggPipe = [];

      const match: any = {};

      if (params.status)
        match.status = { $in: params.status };
      else
        match.status = { $ne: STATUS.DELETED };


      if (searchKey) {
        match["$or"] = [
          { categoryName: { $regex: new RegExp(searchKey, "i") } },
          // { serviceType: { $regex: new RegExp(searchKey, "i") } },
        ];
      }

      if (params.fromDate && !params.toDate) match.created = { "$gte": params.fromDate };
      if (params.toDate && !params.fromDate) match.created = { "$lte": params.toDate };
      if (params.fromDate && params.toDate) match.created = { "$gte": params.fromDate, "$lte": params.toDate };

      aggPipe.push({ $match: match });

      let sort: any = {};
      sortBy && sortOrder
        ? (sort = { [sortBy]: sortOrder })
        : (sort = { created: -1 });
      aggPipe.push({ $sort: sort });

      if (params.limit && params.pageNo) {
        const [skipStage, limitStage] = this.addSkipLimit(
          params.limit,
          params.pageNo
        );
        aggPipe.push(skipStage, limitStage);
      }

      let project: any = {
        _id: 1,
        categoryIdString: 1,
        serviceType: 1,
        categoryName: 1,
        issueTypeName: 1,
        subIssueName: 1,
        status: 1,
        created: 1
      };

      aggPipe.push({ $project: project });

      return await this.dataPaginate(
        this.serviceCategoryModel,
        aggPipe,
        limit,
        pageNo,
        {},
        true
      );
    } catch (error) {
      throw error;
    }
  }

  async getServiceTypeListing(params: ServiceRequest.GetServiceTypeListing) {
    try {
      let { pageNo, limit, searchKey, sortBy, sortOrder } = params;
      const aggPipe = [];

      const match: any = {};

      if (params.status) {
        const statusArray = Array.isArray(params.status)
          ? params.status.flatMap((status) => (typeof status === 'string' ? status.split(',') : status))
          : [];
        match.status = { $in: statusArray };
      } else {
        match.status = { $ne: STATUS.DELETED };
      }


      if (params.categoryId) {
        const categoryIdArray = Array.isArray(params.categoryId)
          ? params.categoryId.flatMap((id) => (typeof id === 'string' ? id.split(',') : id))
          : [];
        match.categoryId = { $in: categoryIdArray.map((id) => toObjectId(id)) };
      }


      if (searchKey) {
        match["$or"] = [
          { name: { $regex: new RegExp(searchKey, "i") } },
          { categoryName: { $regex: new RegExp(searchKey, "i") } },

        ];
      }

      if (params.fromDate && !params.toDate) match.created = { "$gte": params.fromDate };
      if (params.toDate && !params.fromDate) match.created = { "$lte": params.toDate };
      if (params.fromDate && params.toDate) match.created = { "$gte": params.fromDate, "$lte": params.toDate };

      aggPipe.push({ $match: match });

      let sort: any = {};
      sortBy && sortOrder
        ? (sort = { [sortBy]: sortOrder })
        : (sort = { created: -1 });
      aggPipe.push({ $sort: sort });

      if (params.limit && params.pageNo) {
        const [skipStage, limitStage] = this.addSkipLimit(
          params.limit,
          params.pageNo
        );
        aggPipe.push(skipStage, limitStage);
      }

      let project: any = {
        _id: 1,
        name: 1,
        categoryId: 1,
        categoryName: 1,
        serviceIdString: 1,
        status: 1,
        created: 1
      };

      aggPipe.push({ $project: project });

      return await this.dataPaginate(
        this.serviceTypeModel,
        aggPipe,
        limit,
        pageNo,
        {},
        true
      );
    } catch (error) {
      throw error;
    }
  }


}

export const serviceDao = new ServiceDao();
