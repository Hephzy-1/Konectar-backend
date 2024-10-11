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
            return ErrorResponse({ message: `${users} not found!!`}, 500)
        }

        return res.status(200).json(users)

    } catch(error){
        return ErrorResponse(error.message, 500)
    }
};

export const farmerWaitlist = async (req, res, next) => {
    try {
        // Validate request body
        const { error, value } = farmerDetails.validate(req.body);

        if (error) {
            throw new ErrorResponse('Validation Error', 400, error.details);
        }

        const { fullName, farmName, farmLocation, email, phoneNumber, typeOfProduce, farmSize, supplyFrequency, distributionChannels, mainChallenge, additionalOfferrings, updateAndNotification } = value;

        // Check if the necessary fields are present
        if (!fullName || !farmName || !farmLocation || !email || !phoneNumber || !typeOfProduce || !farmSize || !supplyFrequency || !distributionChannels || !mainChallenge || !additionalOfferrings) {
            throw new ErrorResponse("Missing required fields", 400);
        }

        // Check if user already exists
        const userExist = await farmer.findOne({ farmName });
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
            farmSize,
            supplyFrequency,
            distributionChannels,
            mainChallenge,
            additionalOfferrings,
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

