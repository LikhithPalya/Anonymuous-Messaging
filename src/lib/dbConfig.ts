// WE COULD USE THIS AS WELL BUT I FEEL ITS A BIT COMPLEX TO UNDERSTAND FOR A BEGINNER HENCE IVE WRITTEN MY OWN CONNECTION CODE


// import mongoose from "mongoose";

// type ConnectionObject = {
//     isConnected?: number
// }

// const connection: ConnectionObject = {} //initially empty as isConnected is optional

// export default async function dbConnect(): Promise<void>{
//     if(connection.isConnected){
//         console.log("Already connected to db");
//         return
//     }
//     try {
//         const connectDB = await mongoose.connect(process.env.MONGODB_URI || "")
//         console.log(" response of connectDB is ", connectDB);

//         connection.isConnected = connectDB.connections[0].readyState
//         console.log("DB connected successfully");
        
//     } catch (error) {
//         console.log("DB connection failed, the error is-", error);
//         process.exit(1)
        
//     }
// }



import mongoose from "mongoose"

export async function connect(){
    try {
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection
        connection.on('connected', ()=>{
            console.log('MongoDB connected');
        })
        connection.on('error', (error)=>{
            console.log('MongoDB connection is error, the original error is ',error );
            process.exit()
        })
    } catch (error) {
        console.log("something went wrong while connecting to db, the error is", error);
    }
}