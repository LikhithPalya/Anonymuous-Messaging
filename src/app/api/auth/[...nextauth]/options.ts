import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/model/user.model";
import { log } from "node:console";

export const authOptions : NextAuthOptions ={
    providers:[
        CredentialsProvider({ //CREDPROVIDER IS A METHOD OF NEXTAUTH
            //USED TO GENERATE A FORM ON FE
            id: "credentials", 
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jondoe@gmail.com" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any): Promise<any>{ //WE GET A PROMISE IN RETURN
                await dbConnect()
                try {
                    console.log("credentials are", credentials);
                     
                    const user = await UserModel.findOne({
                        $or:[ //FINDING USER DETAILS USING EMAIL OR USERNAME
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    })
                    if(user){
                        console.log('User details is=', user)
                    }
                    if(!user){
                        throw new Error("No user found with this email/username")
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        console.log("user is authenticated");
                        
                        return user
                    }else{
                        throw new Error("incorrect password")
                    }

                } catch (error:any) {
                    console.log("unable to connect to db, error= ",error);
                    throw new Error(error)                    
                }
              }
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
          },

          async jwt({ token, user }) { //WE GET THIS FROM THE RETURNED USER ABOVEtype
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
          }    
    }, 
    pages:{
        signIn: '/sign-in'
    },
    session:{  
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}

// WE ARE DOING THIS IN OPTIONS AS THIS IS PRODUCTION GRADE STUFF
// WE ARE EXPORING AUTHOPTIONS TO USE IT IN ROUTE.TS 0F THE SAME FOLDER