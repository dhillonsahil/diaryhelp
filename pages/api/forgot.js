import pool from '@/lib/db'

// query to create table
// create table forgot(
//     id int primary key auto_increment,
//     token varchar(200) not null,
//     resetTokenExpiration datetime default null,
//     email varchar(255) not null
//     );

const forgot = async (req, res) => {
  // check if user exists
  let {customerMail}= req.body;
  // console.log("Customer mail is " + customerMail)

  try {
    pool.query(`create table if not exists forgot(
      id int primary key auto_increment,
      token varchar(200) not null,
      resetTokenExpiration datetime default null,
      email varchar(255) not null
      );
  `,(error,rows)=>{
      if(error){
          return res.status(500).json({success:false,error:"Internal server error"})
      }
      pool.query(`select * from users where email = ?`,[customerMail],(error,rows,fields)=>{
        if(error){
          console.log(error)
          return res.status(500).json({success:false,error:"Internal server error"})
        }
        if(rows.length==0){return res.status(400).json({success:false,message:"No User fond"})}
  
    })
    })
  
  
  } catch (error) {
    console.log("some error")
  }

  // create tokenId
  const crypto = require('crypto')
  const buffer = crypto.randomBytes(32);
  const resetToken = buffer.toString('hex');

  
  const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour in milliseconds


try {

  pool.query(`create table if not exists forgot(
    id int primary key auto_increment,
    token varchar(200) not null,
    resetTokenExpiration datetime default null,
    email varchar(255) not null
    );
`,(error,rows)=>{
    if(error){
        return res.status(500).json({success:false,error:"Internal server error"})
    }
    pool.query(`INSERT INTO forgot (email,token,resetTokenExpiration) VALUES (?,?,?)`,[customerMail,resetToken,expirationTime],(error,rows,fields)=>{
      if(error){
        console.log(error)
          return res.status(500).json({success:false,error:"Internal server error"})
      }else{
          return res.status(200).json({success:true,message:"Check Your email"})
      }
  })
  })

   
} catch (error) {
    
}


  // send mail
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'sahil2002427@gmail.com',
      pass:"qapmyiwfveewismq"
    }
  })

  const option = {
    from :'sahil2002427@gmail.com',
    to:customerMail,
    subject :'Reset Password - Diary Help',
    text:`To Reset Your Password Click on the Link https://diaryhelp.myrangolidesign.com/forgot?id=${resetToken}`
  }

  transporter.sendMail(option,async function(error,info){
    if(error){
      res.status(200).json({success:false , error:"An error occurred"})
    }else{
      res.status(200).json({success:true})
    }
  })

}

export default forgot;