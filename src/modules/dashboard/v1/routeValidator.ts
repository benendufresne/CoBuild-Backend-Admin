import Joi = require("joi");

export const getDashboardDetails = Joi.object({
    duration:Joi.string().required().description("Yesterday, Last Week, ..."),  
    fromDate: Joi.number().optional().description("in timestamp"),
    toDate: Joi.number().optional().description("in timestamp"),
    isExport: Joi.boolean().optional(),
});
