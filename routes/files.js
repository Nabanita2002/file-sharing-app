const router=require('express').Router();

const multer= require('multer');

const path= require('path')

const File= require('../models/file')

const {v4:uuid4}=require("uuid")
let storage= multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename: (req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;

        cb(null,uniqueName);
    }
})


let upload= multer({
    storage,
    limits:{fileSize:1000000*100},

}).single('file1')



router.post('/',(req,res)=>{
    //validate request

     
 
    upload(req,res, async(err)=>{

        if(!req.file){
            return res.json({error:'please add your file'})
     }


        if(err){
            return res.status(500).send({error: err.message})
        }

        //store into db
         const file=new File({
             filename:req.file.filename,
             uuid:uuid4(),
             path:req.file.path,
             size:req.file.size
         });

         try {
            const response = await file.save();
            return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        } catch (error) {
            return res.status(500).json({ error: 'Error saving file to the database' });
        }
    });

});

router.post('/send',async (req,res)=>{
    // validate req
    const {uuid,emailTo,emailFrom}=req.body;
    if(!uuid|| !emailTo|| !emailFrom){
        return res.status(422).send({error:'All fields are required'})
    }

    //get data from database
    const file=await File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error:"Email already sent!"})
    }

    file.sender=emailFrom;
    file.reciever=emailTo;

    const response= await file.save();

    //send email
  const sendMail= require("../services/emailService");

  sendMail({
    from:emailFrom,
    to:emailTo,
    subject:"inshare file sharing",
    text:`${emailFrom} shared a file with you`,
    html:require("../services/emailTemplate")({
        emailFrom:emailFrom,
        downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires:'24 hours' 


    })
  })

  return res.send({success:true})



})


module.exports=router;