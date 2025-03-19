const express = require("express");
const carbonController = require("../controller/carbonController");
const carbon_route = express();

carbon_route.post('/calculate' , carbonController.calculate_carbon);

carbon_route.post('/gemini' , carbonController.gemini);
module.exports = carbon_route;