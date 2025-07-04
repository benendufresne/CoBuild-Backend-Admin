import {
  REGEX,
  VALIDATION_CRITERIA,
  VALIDATION_MESSAGE,
  GENDER,
  STATUS,
  USER_PREFERENCE,
  fileUploadExts
} from "@config/constant";
import { SERVER } from "@config/environment";
import Joi = require("joi");

export const createJob = Joi.object({
  title: Joi.string()
    .trim()
    .required(),
  categoryName: Joi.string().optional(),
  categoryId: Joi.string().optional(),
  serviceName: Joi.string().optional(),
  serviceId: Joi.string().optional(),
  personalName: Joi.string().required(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).optional(),
    address: Joi.string().optional(),
  }).optional().description("location: {coordinates: [26.5,25.4], address: 'house 1 inner road'}"),
  companyLocation: Joi.object({
    coordinates: Joi.array().items(Joi.number()).optional(),
    address: Joi.string().optional(),
  }).optional().description("location: {coordinates: [26.5,25.4], address: 'house 1 inner road'}"),
  email: Joi.string().optional(),
  fullMobileNo: Joi.string().optional(),
  aboutCompany: Joi.string().optional(),
  priority: Joi.string().required(),
  procedure: Joi.string().optional(),
});

export const getJob = Joi.object({
  jobId: Joi.string().trim().regex(REGEX.MONGO_ID).required()
});

export const updateJob = Joi.object({
  jobId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
  title: Joi.string().optional(),
  categoryName: Joi.string().optional(),
  categoryId: Joi.string().optional(),
  serviceName: Joi.string().optional(),
  serviceId: Joi.string().optional(),
  personalName: Joi.string().optional(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).optional(),
    address: Joi.string().optional(),
  }).optional().description("location: {coordinates: [26.5,25.4], address: 'house 1 inner road'}"),
  companyLocation: Joi.object({
    coordinates: Joi.array().items(Joi.number()).optional(),
    address: Joi.string().optional(),
  }).optional().description("location: {coordinates: [26.5,25.4], address: 'house 1 inner road'}"),
  email: Joi.string().optional(),
  fullMobileNo: Joi.string().optional(),
  aboutCompany: Joi.string().optional(),
  priority: Joi.string().optional(),
  procedure: Joi.string().optional(),
  status: Joi.string().optional()
});

export const jobListing = Joi.object({
  pageNo: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
  priority: Joi.array()
    .items(Joi.string().trim().min(1)).single().optional().description('HIGHT, MEDIUM, LOW'),
  status: Joi.array()
    .items(Joi.string().trim().min(1)).single().optional().description('filter by status COMPLETED, IN_PROGRESS, PENDING'),
  searchKey: Joi.string()
    .allow("")
    .optional()
    .description("Search by name, email"),
  sortBy: Joi.string()
    .trim()
    .valid("created", "name")
    .optional()
    .description("Sort by created"),
  sortOrder: Joi.number()
    .valid(1, -1)
    .optional()
    .description("1 for asc, -1 for desc"),
  fromDate: Joi.number().optional().description("in timestamp"),
  toDate: Joi.number().optional().description("in timestamp"),
  isExport: Joi.boolean().optional(),
  exportTemplate: Joi.boolean().optional(),
});

export const scheduleJob = Joi.object({
  jobId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
  schedule: Joi.number().optional(),
});

export const importJob = Joi.object({
  file: Joi.string().trim().required()
});


export const upload = Joi.object({
  file: Joi.any().meta({ swaggerType: "file" }).required().description(fileUploadExts.join(", ")),
})

