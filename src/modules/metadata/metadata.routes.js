import express from "express";
const router = express.Router();
import { getDistrict, getSubject } from "./metadata.controller.js";



router.get("/get-district", getDistrict);
router.get("/get-subject", getSubject);

export default router; 