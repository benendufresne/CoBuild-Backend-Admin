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

import { logger } from "@lib/index";
import { subAdminDao } from "./subAdminDao";
import { axiosService } from "@lib/axiosService";

const AWS = require("aws-sdk");
export class SubAdminController {
    constructor() {
    }

    async createRoles(params: SubAdminRequest.CreateRole) {
        try {

            const role = await subAdminDao.createRole(params);
            return MESSAGES.SUCCESS.ROLE_CREATED(role);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getRoleDetails(params: SubAdminRequest.GetRoleDetails) {
        try {
            const roleDetails = await subAdminDao.getRoleDetails(params);
            if (!roleDetails) await Promise.reject(MESSAGES.ERROR.ROLE_NOT_FOUND);
            return MESSAGES.SUCCESS.ROLE_DETAILS(roleDetails);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async editRole(params: SubAdminRequest.EditRole, tokenData: TokenData, accessToken: string) {
        try {
            const isExist = await subAdminDao.getRoleDetails(params);
            if (!isExist) await Promise.reject(MESSAGES.ERROR.ROLE_NOT_FOUND);
            const adminList = await subAdminDao.getAdminsForRole(params.roleId);
            if ((params.status == STATUS.DELETED || params.status == STATUS.BLOCKED) && adminList.length > 0) await Promise.reject(MESSAGES.ERROR.ROLE_ALREADY_ASSOCIATED);
            const role = await subAdminDao.editRole(params);
            if (adminList.length > 0) {
                const notificationParams = {
                    "type": "PERMISSION_UPDATE",
                    "userType": "ADMIN",
                    "receiverIds": adminList.map(admin => admin._id.toString()),
                    "details": { "roleId": role._id.toString(), adminName: tokenData.name }
                }
                axiosService.post({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.SEND_NOTFICATION, "body": notificationParams, auth: accessToken });
            }
            return MESSAGES.SUCCESS.ROLE_EDITED(role);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }


    async getRolesListing(params: SubAdminRequest.GetRolesListing) {
        try {
            const roleList = await subAdminDao.getRolesListing(params);
            return MESSAGES.SUCCESS.ROLE_LIST(roleList);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getRolesNameList() {
        try {
            const roleList = await subAdminDao.getRolesNameList();
            return MESSAGES.SUCCESS.ROLE_LIST(roleList);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async addSubAdmin(params: SubAdminRequest.AddSubAdmin, tokenData: TokenData) {
        try {
            const isExist = await subAdminDao.subAdminEmailExists(params.email);
            if (isExist) await Promise.reject(MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
            const roleExists = await subAdminDao.getRoleDetails({ roleId: params.roleId });
            if (!roleExists) await Promise.reject(MESSAGES.ERROR.ROLE_NOT_FOUND);
            const generatedPassword = generatePassword(10)
            const salt = genRandomString(SERVER.SALT_ROUNDS);
            const hash = encryptHashPassword(generatedPassword, salt)

            const dataToInsert = { ...params, salt, hash };
            dataToInsert['userType'] = USER_TYPE.SUB_ADMIN
            dataToInsert['status'] = STATUS.UN_BLOCKED
            const subAdmin = await subAdminDao.addSubAdmin(dataToInsert);

            let mailData = {
                type: MAIL_TYPE.WELCOME_SUB_ADMIN,
                adminName: tokenData.name,
                subAdminName: subAdmin.name,
                role: subAdmin.roleName,
                email: subAdmin.email,
                password: generatedPassword,
            };

            axiosService.postData({
                url: process.env.NOTIFICATION_APP_URL + SERVER.SEND_MAIL,
                body: mailData,
            });

            return MESSAGES.SUCCESS.SUB_ADMIN_CREATED(subAdmin);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async editSubAdmin(params: SubAdminRequest.EditSubAdmin, tokenData: TokenData, accessToken: string) {
        try {
            const isExists = await subAdminDao.subAdminDetails(params.subAdminId)
            if (params.email && params.email != isExists.email) {
                const emailExists = await subAdminDao.subAdminEmailExists(params.email);
                if (emailExists) await Promise.reject(MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
            }
            if (params.roleId != isExists.roleId) {
                const notificationParams = {
                    "type": "PERMISSION_UPDATE",
                    "userType": "USER",
                    "receiverIds": [isExists._id.toString()],
                    "details": { "roleId": isExists.roleId.toString(), adminName: tokenData.name }
                }
                axiosService.post({ "url": SERVER.NOTIFICATION_APP_URL + SERVER.SEND_NOTFICATION, "body": notificationParams, auth: accessToken });
            }
            const subAdmin = await subAdminDao.editSubAdmin(params);
            return MESSAGES.SUCCESS.EDIT_SUB_ADMIN(subAdmin);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async getSubAdminDetails(params: SubAdminRequest.GetSubAdminDetails) {
        try {
            const subAdmin = await subAdminDao.subAdminDetails(params.subAdminId);
            if (!subAdmin) await Promise.reject(MESSAGES.ERROR.SUB_ADMIN_NOT_FOUND);
            return MESSAGES.SUCCESS.SUB_ADMIN_DETAILS(subAdmin);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async subAdminList(params: SubAdminRequest.GetSubAdminList) {
        try {
            const subAdmin = await subAdminDao.subAdminList(params);
            return MESSAGES.SUCCESS.SUB_ADMIN_LIST(subAdmin);
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    async hasPermissionAccess(subAdminId: string, permission: string, permissionType: string) {
        const admin = await subAdminDao.subAdminDetails(subAdminId);
        if (!admin) await Promise.reject(MESSAGES.ERROR.SUB_ADMIN_NOT_FOUND);
        if (admin.userType == USER_TYPE.ADMIN) return true;
        else {
            const role = await subAdminDao.getRoleDetails({ roleId: admin.roleId });
            if (!role) await Promise.reject(MESSAGES.ERROR.ROLE_NOT_FOUND);
            const permissions = role.permissions;
            const modulePermission = permissions.find(
                (perm: any) => perm.module === permission
            );
            if (!modulePermission) {
                return Promise.reject(MESSAGES.ERROR.PERMISSION_NOT_GRANTED);
            }
            if (!modulePermission[permissionType]) {
                return Promise.reject(MESSAGES.ERROR.PERMISSION_NOT_GRANTED);
            }
            return true;
        }
    }
}

export const subAdminController = new SubAdminController();
