import config from "../config/env.js";
import farm from "../models/farm.js";
import farmer from "../models/farmer.js";
import produce from "../models/produce.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { farmerDetails } from "../validators/waitlist.js";

export const farmerWaitlist = async (req, res, next) => {
    try {
        // Log the request body for debugging purposes
        console.log("Request body:", req.body);

        // Validate request body using Joi schema
        const { error, value } = farmerDetails.validate(req.body);
        if (error) {
            console.log("Validation error:", error);
            return res.status(400).json({ message: 'Validation error', details: error.details });
        }

        const { fullName, farmName, farmLocation, email, phoneNumber, typeOfProduce, farmSize, supplyFrequency, distributionChannels, mainChallenge, additionalOfferings, updateAndNotification } = value;

        // Check if farmer with email already exists
        const userExist = await farmer.findOne({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: "Farmer already exists!"});
        }

        // Create and save new farmer
        const newFarmer = await farmer.create({
            fullName,
            email,
            phoneNumber,
            notifications: updateAndNotification 
        });

        // Create and save new farm
        const newFarm = await farm.create({
            farmName,
            location: farmLocation,
            size: farmSize,
            supplyFrequency,
            distributionChannels,
            mainChallenge,
            additionalOfferings,
            farmerId: newFarmer.farmerId  // Reference the new farmer's ID
        });
        console.log(newFarm);

        // Create and save new produce
        const newProduce = await produce.create({
            typeOfProduce,
            farmId: newFarm.farmId  // Reference the new farm's ID
        });

        // Send a success response with farmer, farm, and produce details
        console.log(newFarm, newFarmer, newProduce);
        res.status(201).redirect(config.COMMUNITY_LINK)

    } catch (error) {
        console.error("Error registering new farmer:", error.message);

        // Handle PostgreSQL unique constraint error (code '23505')
        if (error.code === '23505') {
            return res.status(400).json({ message: "Duplicate entry detected", details: error.message });
        }

        // Handle other errors with a generic 500 error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

