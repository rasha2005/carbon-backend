const express = require("express");
const moongose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const carbonRoute = require("./route/carbonRoute")


const app  = express();

dotenv.config();


moongose
.connect(process.env.MONGO_URL)
.then(() => console.log("db connected successfully"))
.catch((err) => {
    console.log(err);
})

app.use(express.json());
app.use(cors({
    origin: 'https://carbon-frontend-two.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/',carbonRoute);

app.listen('3000' , () => {
    console.log("server is listening");
})