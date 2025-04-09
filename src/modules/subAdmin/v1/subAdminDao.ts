"use strict";

import { BaseDao } from "@modules/baseDao/BaseDao";
import { STATUS, DB_MODEL_REF, USER_TYPE } from "@config/constant";
import { toObjectId } from "@utils/appUtils";


export class SubAdminDao extends BaseDao {

    private rolesModel: any;
    private adminModel: any;
    constructor() {
        super();
        this.rolesModel = DB_MODEL_REF.ROLES;
        this.adminModel = DB_MODEL_REF.ADMIN;
    }

    async createRole(params: SubAdminRequest.CreateRole) {
        try {
            return await this.save(this.rolesModel, params);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getRoleDetails(params: SubAdminRequest.GetRoleDetails) {
        try {
            const query = {
                _id: params.roleId,
                status: { $ne: STATUS.DELETED }
            }
            return await this.findOne(this.rolesModel, query);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async editRole(params: SubAdminRequest.EditRole) {
        try {
            const query = {
                _id: params.roleId,
            }
            return await this.findOneAndUpdate(this.rolesModel, query, params, { new: true });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAdminsForRole(roleId: string) {
        try {
            const query = {
                roleId: toObjectId(roleId),
                status: { '$ne': STATUS.DELETED }
            }
            return await this.find(this.adminModel, query, { _id: 1 });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



    async getRolesListing(params: SubAdminRequest.GetRolesListing) {
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
                    { name: { $regex: new RegExp(searchKey, "i") } },
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
                permissions: 1,
                status: 1,
                created: 1
            };

            aggPipe.push({ $project: project });

            return await this.dataPaginate(
                this.rolesModel,
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


    async getRolesNameList() {
        try {
            const aggPipe = [];
            const match: any = {};

            match.status = { $eq: STATUS.UN_BLOCKED };

            aggPipe.push({ $match: match });

            let sort: any = { created: -1 };
            aggPipe.push({ $sort: sort });


            let project: any = {
                _id: 1,
                name: 1
            };

            aggPipe.push({ $project: project });

            return await this.aggregate(
                this.rolesModel,
                aggPipe
            );
        } catch (error) {
            throw error;
        }
    }


    async addSubAdmin(params: SubAdminRequest.AddSubAdmin) {
        try {
            return await this.save(this.adminModel, params);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async subAdminEmailExists(email: string) {
        try {
            return await this.findOne(this.adminModel, { email, status: { $ne: STATUS.DELETED } });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async editSubAdmin(params: SubAdminRequest.EditSubAdmin) {
        try {
            const query = {
                _id: params.subAdminId,
            }
            return await this.findOneAndUpdate(this.adminModel, query, params, { new: true });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async subAdminDetails(subAdminId: string) {
        try {
            return await this.findOne(this.adminModel, { _id: subAdminId, status: { $ne: STATUS.DELETED } });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async subAdminList(params: SubAdminRequest.GetSubAdminList) {
        try {
            let { pageNo, limit, searchKey, sortBy, sortOrder } = params;
            const aggPipe = [];

            const match: any = {};
            match.userType = USER_TYPE.SUB_ADMIN

            if (params.status)
                match.status = { $in: params.status };
            else
                match.status = { $ne: STATUS.DELETED };


            if (searchKey) {
                match["$or"] = [
                    { name: { $regex: new RegExp(searchKey, "i") } },
                    { email: { $regex: new RegExp(searchKey, "i") } },
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
                email: 1,
                roleId: 1,
                roleName: 1,
                status: 1,
                created: 1
            };

            aggPipe.push({ $project: project });

            return await this.dataPaginate(
                this.adminModel,
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

export const subAdminDao = new SubAdminDao();
