import express from "express";
// import isLoggedIn from "../middlewares/isLoggedIn";
const router = express.Router();

import {
    getUsers,
    farmerWaitlist
} from "../controller/userController.js";

router.get("/", getUsers);
router.post("/signup", farmerWaitlist);

export default router;

