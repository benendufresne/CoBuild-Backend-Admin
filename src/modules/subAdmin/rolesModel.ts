"use strict";

import mongoose, { Document, model, Model, Schema } from "mongoose";

import {
    DB_MODEL_REF,
    STATUS,
} from "@config/index";

export interface IRolesCategory extends Document {
    _id: string;
    name: string;
    status: string;
    created: number;
    permissions: {
        module: string;
        moduleId: number;
        view: boolean;
        edit: boolean;
    }[];
}

const rolesSchema: Schema = new mongoose.Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true, auto: true },
        name: { type: String, required: true },
        status: { type: String, required: true, enum: [STATUS.UN_BLOCKED, STATUS.BLOCKED, STATUS.DELETED], default: STATUS.UN_BLOCKED },
        created: { type: Number, default: Date.now },
        permissions: {
            type: [
                {
                    module: { type: String, required: true },
                    moduleId: { type: Number, required: true },
                    view: { type: Boolean, required: true },
                    edit: { type: Boolean, required: true },
                },
            ],
            required: true,
            default: [],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

rolesSchema.post("save", async function (doc) {
    setTimeout(() => { }, 10);
});

rolesSchema.post("findOneAndUpdate", function (doc) {
    setTimeout(() => { }, 10);
});

rolesSchema.index({ created: -1 });

// Export user
export const roles: Model<IRolesCategory> = model<IRolesCategory>(DB_MODEL_REF.ROLES, rolesSchema);
