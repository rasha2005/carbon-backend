const CarbonRecord = require("../model/carbonModel");
const axios = require("axios");

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

const FetchAPI = async(req,res) => {
    try {
        const { distance, transportType } = req.body;
        console.log("process.env.ANTHROPIC_API_KEY",)
        const response = await axios.post("https://api.anthropic.com/v1/messages", {
            model: "claude-3-opus-20240229",
            messages: [
                {
                    role: "user",
                    content: `I traveled ${distance} km using a ${transportType}. Give me a suggestion to reduce my carbon footprint.`
                }
            ],
            max_tokens: 100
        }, {
            headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY, 
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            }
        });

        res.json(response.data);
        // console.log("res" , response.data)
    } catch (error) {
        console.error("Error calling Claude API:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }

}

module.exports = {
    calculate_carbon,
    FetchAPI
}