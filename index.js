const express =require ("express");
const app= express();
const port=process.env.port||4000;
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const Mentor=require("./model/mentorschema");
const Students=require("./model/studentschema")
require("dotenv").config();
Db=process.env.Db;

app.use(bodyParser.json())



mongoose.connect(Db,{}).then(()=>{console.log("db connected")}).catch(()=>{
    console.log("not able to connect")
})
//postmentor details
app.post('/mentor',async(req,res)=>{
    try{
        const mentor=new Mentor(req.body);

        await mentor.save();
        res.status(200).send(mentor);
    }
    catch(err){
    res.status(400).send(err.message)
    }
})
//post student details

app.post('/student',async(req,res)=>{
    try{
        const Student=new Students(req.body);

        await Student.save();
        res.status(200).send(Student);
    }
    catch(err){
    res.status(400).send(err.message)
    }
})
app.post("/mentor/:mentorId/assign",async(req,res)=>{
   try{
    const mentor = await Mentor.findById(req.params.mentorId);
    const students=await Students.find({_id:{$in:req.body.students}});
    students.forEach((student) => {
        student.cmentor=mentor._id;
        student.save();
    });
    mentor.students=[...mentor.students,...students.map(student=>student._id)];
    await mentor.save();
    
    res.send(mentor)}
    catch (err){
     res.status(400).send(err)
    }
})
app.put("/student/:studentId/assignmentor/:mentorId", async (req, res) => {
    try {
      // Find the student by ID
      const student = await Students.findById(req.params.studentId);
  
      if (!student) {
        return res.status(404).send("Student not found");
      }
  
      // Find the mentor by ID
      const mentor = await Mentor.findById(req.params.mentorId);
  
      if (!mentor) {
        return res.status(404).send("Mentor not found");
      }
  
      // If the student already has a current mentor, move them to a previous mentor
      if (student.cmentor) {
        student.pmentor.push(student.cmentor);
      }
  
      // Assign the new mentor to the student
      student.cmentor = mentor._id;
  
      // Save the changes to the student document
      await student.save();
  
      res.send(student);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get("/mentor/:mentorId/students", async (req, res) => {
    try {
      const mentor = await Mentor.findById(req.params.mentorId).populate("students");
  
      if (!mentor) {
        return res.status(404).send("Mentor not found");
      }
  
      res.send(mentor);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get("/prementor/:studentId/mentor", async (req, res) => {
    try {
      const student = await Students.findById(req.params.studentId);
      
      if (!student) {
        return res.status(404).send("Student not found");
      }
      
      res.send(student.pmentor); // Return the populated pmentor field of the student
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  // app.get("/mentor/nomentor/student", async (req, res) => {
//     try {
//       // Use the correct query to find students with no mentor (assuming cmentor is an array)
//       const students = await Students.findById(cmentor:size=0);
  
//       res.send(students);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });


  app.listen(port,()=>{
 console.log(`port is connected ${port}`)
})
