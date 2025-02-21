import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import { z} from "zod"
import {usernameValidation} from "@/schemas/signUp.schema"
import { log } from "node:console";

 const UsernameQuerySchema = z.object({
    username:usernameValidation
 })

 export async function GET(request:Request){
    await dbConnect()

    try {
        const {searchParams} = new URL (request.url)
        const queryParam ={
            uername: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
    } catch (error) {
        console.error("error checking username ", error);
        return Response.json(
            {
                success:false,
                message: "Error checking username"
            },{
                status:500
            }
        )
        
    }
 }