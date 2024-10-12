import Joi from "joi";

export const farmerDetails = Joi.object({
  fullName: Joi.string().trim().required(), 
  farmName: Joi.string().trim().required(), 
  farmLocation: Joi.string().required(), 
  email: Joi.string().email().trim().required(),
  
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international number'
    }),
  
  typeOfProduce: Joi.string().required(), 
  farmSize: Joi.string().required(), 
  supplyFrequency: Joi.string().required(), 
  distributionChannels: Joi.string().required(), 
  mainChallenge: Joi.string().required(), 
  additionalOfferings: Joi.string().required(),  
  updateAndNotification: Joi.boolean().default(false)
});