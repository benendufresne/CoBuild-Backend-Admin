import {
  DEVICE_TYPE,
  NOTIFICATION_TYPE,
  REGEX,
  USER_TYPE,
} from "@config/index";
import Joi = require("joi");

export const addNotification = Joi.object({
  type: Joi.string()
    .trim()
    .valid(...Object.values(NOTIFICATION_TYPE))
    .optional(),
  users: Joi.string()
    .trim()
    .valid(...Object.values(DEVICE_TYPE))
    .optional(),
  userType: Joi.string()
    .trim()
    .valid(...Object.values(USER_TYPE))
    .optional(),
  title: Joi.string().trim().optional().description("Notification Title"),
  description: Joi.string().trim().optional().description("Notification Message")
});

export const notificationList = Joi.object({
  pageNo: Joi.number().required().description("Page no"),
  limit: Joi.number().required().description("limit"),
  searchKey: Joi.string().allow("").optional().description("Search by title"),
  users: Joi.array()
    .items(Joi.string().trim().min(1)).single().optional(),
  // users: Joi.array()
  //   .items(Joi.string()
  //     .trim()
  //     .valid(...Object.values(DEVICE_TYPE))
  //     .optional()),
  sortBy: Joi.string()
    .trim()
    .valid("created")
    .optional()
    .description("Sort by created"),
  sortOrder: Joi.number()
    .valid(1, -1)
    .optional()
    .description("1 for asc, -1 for desc"),
  fromDate: Joi.number().optional().description("in timestamp"),
  toDate: Joi.number().optional().description("in timestamp"),
});

export const notificationDetails = Joi.object({
  notificationId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
});

export const UpdateNotification = Joi.object({
  notificationId: Joi.string().trim().regex(REGEX.MONGO_ID).required(),
  status: Joi.string().trim().optional()
});

export const readNotifications = Joi.object({
  notificationIds: Joi.array().items(Joi.string().trim().regex(REGEX.MONGO_ID)).required(),
})

export const clearNotification = Joi.object({
  notificationId: Joi.string().trim().regex(REGEX.MONGO_ID).optional(),
})