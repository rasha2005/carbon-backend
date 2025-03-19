const CarbonRecord = require("../model/carbonModel");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const calculate_carbon = async(req,res) => {
    try{
        console.log("ffffff")
        const { distance, transportType } = req.body;
        console.log("si" , distance)
        console.log("si" , transportType)

        const emissionFactors = {
            car: 0.21,
            bus: 0.1,
            train: 0.05,
          };
          if (!distance || !transportType || !emissionFactors[transportType]) {
            return res.status(400).json({ error: "Invalid input values" });
        }

        const carbonFootprint = parseFloat(distance * emissionFactors[transportType]).toFixed(2);
        console.log("carbonFootprintcarbonFootprint",carbonFootprint)
          if(carbonFootprint){
            const newRecord = await CarbonRecord.create({
                distance,
                transportType,
                carbonFootprint,
                timestamp: new Date(),
            });
            await newRecord.save();
          console.log("newRecord" , newRecord)
          res.status(201).json({
            success: true,
            message: "calculated successfully",
            data:newRecord
        });
    
    }else{
        return res.status(400).json({ error: "Something went Wrong!" });
    }

    }catch(err){
        console.log(err);
    }
}

const gemini = async(req,res) => {
    try{
        console.log("hehe");
        const { distance, transportType } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `I traveled ${distance} km using a ${transportType}. Give me a suggestion to reduce my carbon footprint.keep it short but clear ,can have minimum of 2 points`;
        
        const result = await model.generateContent(prompt);
        console.log("return",result.response.text());
        res.json({result:result.response.text()})
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    calculate_carbon,
    gemini
}