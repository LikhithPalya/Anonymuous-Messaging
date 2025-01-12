import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(5, "username should be atleast 5 characters")
    .max(20, "username should be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address!"}),
    password: z.string().min(6, {message: "min length of password should be 6 characters"})
})