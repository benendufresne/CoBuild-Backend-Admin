"use strict";

import mongoose, { Document, model, Model, Schema } from "mongoose";

import {
  DB_MODEL_REF,
  STATUS,
} from "@config/index";

export interface IServiceType extends Document {
  _id: string;
  name: string;
  categoryId: string;
  serviceIdString: string;
  categoryName: string;
  status: string;
  created: number;
}



const serviceTypeSchema: Schema = new mongoose.Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    serviceIdString: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    categoryName: { type: String, required: true },
    status: { type: String, required: true, enum: [STATUS.ACTIVE,STATUS.DELETED], default: STATUS.ACTIVE },    
    created: { type: Number, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


serviceTypeSchema.post("save", async function (doc) {
  setTimeout(() => {}, 10);
});

serviceTypeSchema.post("findOneAndUpdate", function (doc) {
  setTimeout(() => {}, 10);
});

serviceTypeSchema.index({ created: -1 });


// Export user
export const service_types: Model<IServiceType> = model<IServiceType>(DB_MODEL_REF.SERVICE_TYPE, serviceTypeSchema);
