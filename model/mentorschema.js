const mongoose=require("mongoose");

const mentorschema=new mongoose.Schema({
    name:String,
    students:[{type:mongoose.Schema.Types.ObjectId,ref:"Students"}]
});

const Mentor=mongoose.model("mentor",mentorschema)
module.exports=Mentor;
