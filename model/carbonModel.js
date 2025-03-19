const mongoose = require("mongoose");

const carbonSchema = mongoose.Schema({
    distance:{
        type:Number,
        required:true
    },
    transportType:{
        type:String,
        required:true
    },
    carbonFootprint:{
        type:mongoose.Schema.Types.Double,
        required:true,
    },

})

module.exports = mongoose.model('carbon',carbonSchema);