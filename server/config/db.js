import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
/*
import mongoose, { connect } from 'mongoose';

const connectDB = async () => {
  try {
      const conn = await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Las opciones useNewUrlParser y useUnifiedTopology ya no son necesarias en las versiones modernas de Mongoose
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Si la conexión es exitosa, se imprime el host
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Si hay un error de conexión (como el bad auth), se imprime y se sale del proceso
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
*/