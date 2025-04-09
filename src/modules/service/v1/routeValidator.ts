import {
  REGEX,
  VALIDATION_CRITERIA,
  VALIDATION_MESSAGE,
  GENDER,
  STATUS,
  USER_PREFERENCE,
  SERVICE_TYPE
} from "@config/constant";
import { SERVER } from "@config/environment";
import Joi = require("joi");
export const serviceCategory = Joi.object({
  serviceType: Joi.string()
    .trim()
    .valid(SERVICE_TYPE.CATEGORY_SERVICE, SERVICE_TYPE.CABLE_CONSULTING_SERVICE)
    .required(),
  categoryName: Joi.string()
    .trim()
    .required(),
  issueTypeName: Joi.string()
    .trim()
    .optional(),
  subIssueName: Joi.array().items(Joi.string().trim()).optional()
});

export const editServiceCategory = Joi.object({
  categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),

  serviceType: Joi.string()
    .trim()
    .valid(SERVICE_TYPE.CATEGORY_SERVICE, SERVICE_TYPE.CABLE_CONSULTING_SERVICE)
    .optional(),
  categoryName: Joi.string()
    .trim()
    .optional(),
  issueTypeName: Joi.string()
    .trim()
    .optional(),
  subIssueName: Joi.array().items(Joi.string().trim()).optional(),
  status: Joi.string()
    .valid(STATUS.DELETED)
    .optional()
});

export const getServiceCategory = Joi.object({
  categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
});

export const serviceType = Joi.object({
  name: Joi.string().trim().required(),
  categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).required()
});

export const getServiceType = Joi.object({
  serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
});

export const editServiceType = Joi.object({
  serviceId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
  name: Joi.string().trim().optional(),
  status: Joi.string()
    .valid(STATUS.DELETED)
    .optional()
})

export const getServiceIdList = Joi.object({
  serviceType: Joi.string().trim().optional(),
  // categoryName: Joi.string().trim().optional(),
  // issueTypeName: Joi.string().trim().optional(),
  searchKey: Joi.string()
    .allow("")
    .optional()
    .description("Search by name"),
})

export const getServiceCategoryListing = Joi.object({
  pageNo: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
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
});

export const getServiceTypeListing = Joi.object({
  categoryId: Joi.array()
    .items(Joi.string().trim().min(1)).single().optional(),
  pageNo: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
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
});


export const getServiceTypeIdListing = Joi.object({
  categoryId: Joi.string().trim().regex(REGEX.MONGO_ID).optional()
});