import config from "../config/env.js";
import farm from "../models/farm.js";
import farmer from "../models/farmer.js";
import produce from "../models/produce.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { farmerDetails } from "../validators/waitlist.js";

export const getUsers = async (req, res) => {
    try {
        const users = await farmer.find();

        if (!users) {
            return ErrorResponse('No users not found!!', 400)
        }

        return res.status(200).json(users)

    } catch(error){
        return ErrorResponse(error.message, 500)
    }
};

export const farmerWaitlist = async (req, res, next) => {
    try {
        // Validate request body
        console.log(req.body);
        const { error, value } = farmerDetails.validate(req.body);

        if (error) {
            console.log(error.message)
            throw new ErrorResponse('Input Error', 400, error.details);
        }

        const { fullName, farmName, farmLocation, email, phoneNumber, typeOfProduce, farmSize, supplyFrequency, distributionChannels, mainChallenge, additionalOfferings, updateAndNotification } = value;

        // Check if user already exists
        const userExist = await farm.findOne({ farmName });
        if (userExist) {
            throw new ErrorResponse("User already exists!", 400);
        }

        // Create new user object
        const newFarmer = new farmer({
            fullName,
            email,
            phoneNumber,
            updateAndNotification,
        });

        // Create new farm object
        const newFarm = new farm({
            farmLocation,
            farmSize,
            supplyFrequency,
            distributionChannels,
            mainChallenge,
            additionalOfferings,
            farmerId: newFarmer.farmerId
        });

        // Create new produce
        const newProduce = new produce({
            typeOfProduce,
            farmId: newFarm.farmId
        });

        // Save new user, farm, and produce
        await newFarmer.save();
        await newFarm.save();
        await newProduce.save();

        res.status(201).redirect(config.COMMUNITY_LINK);
    } catch (error) {
        console.error("Error registering new user:", error.message);
        
        // Use ErrorResponse for PostgreSQL duplicate key error
        if (error.code === '23505') {
            throw new ErrorResponse("Duplicate key value entered.", 400);
        }

        // Let the global error handler handle other errors
        next(error);
    }
};

