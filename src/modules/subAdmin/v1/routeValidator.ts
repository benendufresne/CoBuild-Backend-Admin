import {
    REGEX,
    VALIDATION_CRITERIA,
    VALIDATION_MESSAGE,
    GENDER,
    STATUS,
    USER_PREFERENCE
} from "@config/constant";
import { SERVER } from "@config/environment";
import Joi = require("joi");

export const createRole = Joi.object({
    name: Joi.string()
        .trim()
        .required(),
    permissions: Joi.array()
        .items(Joi.object())
        .required()
});

export const editRole = Joi.object({
    roleId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    name: Joi.string()
        .trim()
        .optional(),
    permissions: Joi.array()
        .items(Joi.object())
        .optional(),
    status: Joi.string()
        .valid(STATUS.DELETED, STATUS.UN_BLOCKED, STATUS.BLOCKED)
        .optional()
});

export const getRoleDetails = Joi.object({
    roleId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
});

export const getRolesListing = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    status: Joi.array()
        .items(Joi.string().trim().min(1)).single().optional().description('filter by status ACTIVE, INACTIVE'),
    searchKey: Joi.string()
        .allow("")
        .optional()
        .description("Search by name"),
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


export const addSubAdmin = Joi.object({
    name: Joi.string()
        .trim()
        .required(),
    email: Joi.string()
        .trim()
        .lowercase()
        .regex(REGEX.EMAIL)
        .required()
        .messages({
            "string.pattern.base": VALIDATION_MESSAGE.email.pattern,
        }),
    roleId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    roleName: Joi.string()
        .trim()
        .required(),
});


export const getSubAdminDetails = Joi.object({
    subAdminId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
});

export const editSubAdminDetails = Joi.object({
    subAdminId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
    name: Joi.string()
        .trim()
        .optional(),
    email: Joi.string()
        .trim()
        .lowercase()
        .regex(REGEX.EMAIL)
        .optional()
        .messages({
            "string.pattern.base": VALIDATION_MESSAGE.email.pattern,
        }),
    roleId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
    roleName: Joi.string()
        .trim()
        .optional(),
    status: Joi.string()
        .valid(STATUS.DELETED, STATUS.BLOCKED, STATUS.UN_BLOCKED)
        .optional()
});


export const getSubAdminListing = Joi.object({
    pageNo: Joi.number().min(1).required(),
    limit: Joi.number().min(1).required(),
    status: Joi.array()
        .items(Joi.string().trim().min(1)).single().optional().description('filter by status ACTIVE, INACTIVE'),
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