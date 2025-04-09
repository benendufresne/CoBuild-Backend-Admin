"use strict";

import mongoose, { Document, model, Model, Schema } from "mongoose";

import {
  DB_MODEL_REF,
  SERVICE_TYPE,
  STATUS,
} from "@config/index";

export interface IServiceCategory extends Document {
  _id: string;
  categoryIdString: string;
  serviceType: string;
  categoryName: string;
  issueTypeName: string;
  subIssueName: string[];
  status: string;
  created: number;
}

const serviceCategorySchema: Schema = new mongoose.Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    categoryIdString: { type: String, required: true },
    serviceType: { type: String, required: true, enum: [SERVICE_TYPE.CATEGORY_SERVICE, SERVICE_TYPE.CABLE_CONSULTING_SERVICE] },
    categoryName: { type: String, required: true },
    issueTypeName: { type: String, required: false },
    subIssueName: { type: [String], required: false },
    status: { type: String, required: true, enum: [STATUS.ACTIVE, STATUS.DELETED], default: STATUS.ACTIVE },
    created: { type: Number, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

serviceCategorySchema.post("save", async function (doc) {
  setTimeout(() => { }, 10);
});

serviceCategorySchema.post("findOneAndUpdate", function (doc) {
  setTimeout(() => { }, 10);
});

serviceCategorySchema.index({ created: -1 });

export const service_categories: Model<IServiceCategory> = model<IServiceCategory>(DB_MODEL_REF.SERVICE_CATEGORY, serviceCategorySchema);

