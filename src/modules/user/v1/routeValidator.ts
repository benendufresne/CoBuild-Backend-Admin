import {
  REGEX,
  VALIDATION_CRITERIA,
  VALIDATION_MESSAGE,
  STATUS,
} from "@config/constant";
import { SERVER } from "@config/environment";
import Joi = require("joi");

export const addUser = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Name must be a string.",
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name must not exceed 50 characters.",
      "string.empty": "Name is required.",
      "any.required": "Name is required.",
    }),

  countryCode: Joi.string().required(),
  mobileNo: Joi.string()
    .trim()
    .regex(REGEX.MOBILE_NUMBER)
    .required()
    .messages({ "string.pattern.base": VALIDATION_MESSAGE.mobileNo.pattern }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .regex(REGEX.EMAIL)
    .required()
    .messages({
      "string.email": "Invalid email format.",
      "string.pattern.base": "Email does not match the required pattern.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).optional(),
      address: Joi.string().optional(),
    }).optional().description("location: {coordinates: [26.5,25.4], address: 'house 1 inner road'}"),
  
});


export const userListing = Joi.object({
  isExport: Joi.boolean().optional(),
  pageNo: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
  status: Joi.array()
    .items(Joi.string().trim().min(1)).single().optional().description('filter by status UN_BLOCKED, BLOCKED'),
  searchKey: Joi.string()
    .allow("")
    .optional()
    .description("Search by name, email"),
  sortBy: Joi.string()
    .trim()
    .valid("created","name")
    .optional()
    .description("Sort by created"),
  sortOrder: Joi.number()
    .valid(1, -1)
    .optional()
    .description("1 for asc, -1 for desc"),
  fromDate: Joi.number().optional().description("in timestamp"),
  toDate: Joi.number().optional().description("in timestamp"),
  assistantId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
  isSharedTask: Joi.boolean().optional(),
  userId: Joi.string().trim().regex(REGEX.MONGO_ID).optional()
});

export const userDetail = Joi.object({
  userId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
});


export const blockDeleteUser = Joi.object({
  type: Joi.string()
    .valid(STATUS.BLOCKED, STATUS.UN_BLOCKED, STATUS.DELETED)
    .required(),
  userId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
})


export const deleteAccount = Joi.object({
  password: Joi.string()
    .trim()
    .regex(REGEX.PASSWORD)
    .min(VALIDATION_CRITERIA.PASSWORD_MIN_LENGTH)
    .max(VALIDATION_CRITERIA.PASSWORD_MAX_LENGTH)
    .default(SERVER.DEFAULT_PASSWORD)
    .required()
})


export const editUser = Joi.object({
  userId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
  name: Joi.string().trim().optional(),
  email: Joi.string()
  .trim()
  .lowercase()
  // .email({ minDomainSegments: 2 })
  .regex(REGEX.EMAIL)
  .required()
  .messages({
    "string.pattern.base": VALIDATION_MESSAGE.email.pattern,
  }),
  countryCode: Joi.string().required(),
  mobileNo: Joi.string()
    .trim()
    .regex(REGEX.MOBILE_NUMBER)
    .optional()
    .messages({ "string.pattern.base": VALIDATION_MESSAGE.mobileNo.pattern }),
    location: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number().messages({ 
          "number.base": "Please enter a valid address" 
        }))
        .optional()
        .messages({
          "array.includes": "Please enter a valid address",
        }),
      address: Joi.string().optional(),
    })
      .optional()
      .description("location: {coordinates: [26.5,25.4], address: 'house 1 inner road'}"),
});