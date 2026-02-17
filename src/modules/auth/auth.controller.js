import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";


const registerUser = async(req, res)=>{

    const {id, fullName, email, password, mobile} = req.body;
    const userExists = await prisma.test.findUnique({
        where: {
            email: email
        }
    });

    if(userExists){
        return res.status(400).json({ message: "User already exists" });
    }

    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = await prisma.test.create({
        data: {
            id,
            fullName,
            email,
            password: hashedPassword,
            mobile
        }
    });

    res.json({ message: "User Registered", data: newUser });

}



// const loginUser = async(req, res) =>{

// }



export default registerUser;
