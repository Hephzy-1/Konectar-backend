import Joi from "joi";

export const farmerDetails = Joi.object({
  fullName: Joi.string().trim().required(), 
  farmName: Joi.string().trim().required(), 
  farmLocation: Joi.string().required(), 
  email: Joi.string().email().trim().required(),
  
  phoneNumber: Joi.string()
    .pattern(/^\+234[789][01]\d{8}$|^0[789][01]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Nigerian number (e.g., +2348012345678 or 08012345678)'
    }),
  
  typeOfProduce: Joi.string().required(), 
  farmSize: Joi.string().required(), 
  supplyFrequency: Joi.string().required(), 
  distributionChannels: Joi.string().required(), 
  mainChallenge: Joi.string().required(), 
  additionalOfferings: Joi.string().required(),  
  updateAndNotification: Joi.boolean().default(false)
});