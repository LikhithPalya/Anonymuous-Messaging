import {dbConnect} from "@/lib/dbConfig" 
import UserModel from "@/model/user.model"
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

export async function POST(request: Request){
    console.log("connecting to db")
    await dbConnect()

    try {
        const {username,email,password} = await request.json()

       const exisitinguserVerifiedByUsername = await UserModel.findOne({
            username, 
            isVerified:true
        })

        if(exisitinguserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            }, {status:400})
        }

        const ExistingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 +Math.random()*900000).toString()

        if(ExistingUserByEmail){
            if(ExistingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists with this email."
                },{
                    status:400
                })
            }else{ // user exisits but not verified
                const hashedPassword = await bcrypt.hash(password, 10)
                ExistingUserByEmail.password = hashedPassword
                ExistingUserByEmail.verifyCode = verifyCode
                ExistingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) 
           
                await ExistingUserByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date() // as expiryDate is an obj it can be modified
            expiryDate.setHours(expiryDate.getHours() +1)
       
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [] //array
            })

            await newUser.save()
        }

        //SEND VERIFICATION EMAIL
        const emailResponse = await sendVerificationEmail(email,username,verifyCode) 
        if(!emailResponse.success){ //.SUCCESS IS ONE OF THE PARAMS OF THE CONSOLE LOG OF EMAIL RESPONSE
            return Response.json({
                success:false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success:true,
            message: "user resgistered successfully, please verify your email!"
        }, {status: 201})


    } catch (error) {
        console.log("Error registering user, the error is ", error);
        
        return Response.json({
            success:false,
            message:"Error registering user"
        },{
            status:500
        })
    }

}