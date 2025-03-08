// require('dotenv').config()

import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config(
    {
        path : './.env'
    }
)



connectDB()
.then(() =>{
    app.listen(process.env.PORT || 3002,()=>{
        console.log(` ∷ Server is running on Port :${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MongoDB connection failed !!! ",err);
})







/*
import express from "express";

const app = express()


;( async ()=> {
    try
    {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error) =>{
        console.error("Error :",error);
        throw error

       })

       app.listen(process.env.PORT, () =>{
        console.log(`Server is running on :${process.env.PORT}`);
       })



    }
    catch( error){
        console.error("Error :",error);
        throw err
    }
}) ()

*/