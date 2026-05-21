import { randomFill } from "crypto";
import {getDistrictDataService, getSubjectService} from "./metadata.service.js";


// Get District Data Contoller

export const  getDistrict = async (req,res)=>{
    try {
        const districtData  = await getDistrictDataService();        
        return res.status(200).json({
            success: true,
            message: "District data fetched successfully",
            data:districtData
        });

    } catch (error) {
         return res.status(400).json({
            success: false,
            message: "Faild to fetch district data."

        });
    }
}  
// Get Subject Data Contoller
export const getSubject = async (req, res) =>{
  
    try {
        const subjectData = await getSubjectService();
        return res.status(200).json({
            success:true,
            message:"Sunject data fetched successfully",
            data: subjectData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Faild to fetch subject data."
        });
    }
}


