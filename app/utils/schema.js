import mongoose from "mongoose";

// Define the schema (you may want to define specific fields)
const propertySchema = new mongoose.Schema({});

// Create or retrieve the model
export async function getPropertiesModel() {
  // Check if the model already exists to prevent recompilation
  const modelName = "properties";
  if (mongoose.models[modelName]) {
    return mongoose.model(modelName);
  }
  return mongoose.model(modelName, propertySchema);
}
