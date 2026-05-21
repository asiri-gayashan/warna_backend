import { prisma } from "../../config/db.js";



export const getDistrictDataService = async() => {
    try {
        const DistrictData =  await prisma.district.findMany();
        return DistrictData;
    } catch (error) {
       throw new Error(`Error fetching grades: ${error.message}`);     
    }
}



export const getSubjectService = async() => {
    try {
        const SubjectData =  await prisma.subject.findMany();
        return SubjectData;
    } catch (error) {
       throw new Error(`Error fetching grades: ${error.message}`);     
    }
}



