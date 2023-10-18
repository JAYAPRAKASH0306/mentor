const mongoose=require("mongoose");

const studentschema=new mongoose.Schema({
    name:String,
    cmentor:{type:mongoose.Schema.Types.ObjectId,ref:"Mentor"},
    pmentor:[{type:mongoose.Schema.Types.ObjectId,ref:"Mentor"}]


});

const Students= mongoose.model("Students",studentschema)
module.exports=Students;
