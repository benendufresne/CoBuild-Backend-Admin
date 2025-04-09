"use strict";

import { BaseDao } from "@modules/baseDao/BaseDao";

import {
  STATUS,
  DB_MODEL_REF,
  GEN_STATUS,
} from "@config/constant";
import { toObjectId } from "@utils/appUtils";
import { redisClient } from "@lib/redis/RedisClient";

export class AdminDao extends BaseDao {
  private modelAdmin: any;
  private modelUser: any;
  private modelRole: any;
  private modelPayments: any;

  constructor() {
    super();
    this.modelAdmin = DB_MODEL_REF.ADMIN;
    this.modelUser = DB_MODEL_REF.USER;
    this.modelRole = DB_MODEL_REF.ROLES;

  }

  /**
   * @function isEmailExists
   */
  async isEmailExists(params, userId?: string) {
    try {
      const query: any = {};
      query.email = params.email;
      if (userId) query._id = { $not: { $eq: userId } };
      query.status = {
        $in: [GEN_STATUS.UN_BLOCKED, GEN_STATUS.BLOCKED, GEN_STATUS.PENDING],
      };

      const projection = { updatedAt: 0, refreshToken: 0 };

      return await this.findOne(this.modelAdmin, query, projection);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  /**
   * @function findAdminById
   */
  async findAdminById(userId: string, project = {}) {
    try {
      const query: any = {};
      query._id = userId;
      query.status = { $ne: STATUS.DELETED };

      const projection = Object.values(project).length
        ? project
        : { createdAt: 0, updatedAt: 0 };

      return await this.findOne(this.modelAdmin, query, projection);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  /**
   * @function createAdmin
   */
  async createAdmin(params: AdminRequest.Create) {
    try {
      return await this.save(this.modelAdmin, params);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  /**
   * @function changePassword
   */
  async changePassword(params, userId?: string) {
    try {
      const query: any = {};
      if (userId) query._id = userId;
      if (params.email) query.email = params.email;

      const update = {};
      update["$set"] = {
        hash: params.hash,
      };

      return await this.updateOne(this.modelAdmin, query, update, {});
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  /**
   * @function editProfile
   */
  async editProfile(params: AdminRequest.EditProfile, userId: string) {
    try {
      const query: any = {};
      query._id = userId;

      const update = {};
      update["$set"] = { ...params };
      const options = { new: true };

      return await this.findOneAndUpdate(
        this.modelAdmin,
        query,
        update,
        options
      );
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  /**
   * @function updateStatus
   */
  async updateStatus(params) {
    try {
      const query = {
        _id: params.userId,
      };
      const update = {
        status: STATUS.UN_BLOCKED,
        reinvite: false,
      };
      return await this.updateMany(this.modelAdmin, query, update, {});
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async removeLoginHistory(params) {
    try {
      let model: any = DB_MODEL_REF.LOGIN_HISTORY;
      const query = {
        "userId._id": toObjectId(params.userId),
        isLogin: true,
      };
      const update: any = {};
      update["$set"] = { isLogin: false };
      const loginData = await this.find(model, query, { deviceId: 1 });
      await this.updateMany(model, query, update, {});

      console.log(
        "******************",
        Array.isArray(loginData),
        loginData.length > 0,
        "***********loginData**************",
        loginData
      );
      // Check if loginData is an array and has at least one item
      if (Array.isArray(loginData) && loginData.length > 0) {
        const firstLoginItem = loginData[0];
        await redisClient.deleteKey(
          `${params.userId}.${firstLoginItem.deviceId}`
        );
      } else {
        console.log("No login data found for the specified user.");
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  /**
   * @function isEmailExistsWithStatus
   */
  async isEmailExistsWithStatus(params, userId?: string) {
    try {
      const query: any = {};
      query._id = toObjectId(params.adminId);
      query.status = { $eq: GEN_STATUS.PENDING };

      const projection = { updatedAt: 0, refreshToken: 0 };

      return await this.findOne(this.modelAdmin, query, projection);
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async isAdminExist(adminId) {
    try {
      return await this.findOne(
        this.modelAdmin,
        { _id: toObjectId(adminId), status: STATUS.UN_BLOCKED },
        { _id: 1 }
      );
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async getRoleDetailsById(roleId) {
    try {
      return await this.findOne(
        this.modelRole,
        { _id: roleId });
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async updateDeviceToken(userId: string, deviceToken: string) {
    try {
      let model: any = DB_MODEL_REF.LOGIN_HISTORY;

      const query = {
        'userId._id': userId,
        isLogin: true
      };
      const update = {
        deviceToken: deviceToken,
      };
      const sort = { created: -1 };
      return await this.updateOne(model, query, update, { $sort: sort });
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }
}

export const adminDao = new AdminDao();
