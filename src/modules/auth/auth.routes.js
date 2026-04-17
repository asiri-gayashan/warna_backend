import express from "express";
const router = express.Router();
import  {registerUser , loginUser, refresh} from "./auth.controller.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/refresh', refresh);


export default router;
