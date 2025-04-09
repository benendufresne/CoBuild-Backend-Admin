"use strict";

import { BaseDao } from "@modules/baseDao/BaseDao";
import { STATUS, DB_MODEL_REF } from "@config/constant";


export class SubAdminDao extends BaseDao {

    private rolesModel: any;
    private adminModel: any;
    constructor() {
        super();
        this.adminModel = DB_MODEL_REF.ADMIN;
    }

    async getDashboardDetails(params: DashboardRequest.GetDetails) {
        try {
            return await this.save(this.rolesModel, params);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

export const subAdminDao = new SubAdminDao();
