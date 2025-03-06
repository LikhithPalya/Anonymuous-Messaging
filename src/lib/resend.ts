import { Resend } from 'resend';
console.log("Resend API Key:", process.env.RESEND_API_KEY ? "Loaded" : "Missing");

export const resend = new Resend(process.env.RESEND_API_KEY);