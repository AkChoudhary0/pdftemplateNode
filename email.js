 const bcrypt = require('bcrypt');
 const password = async()=>{
 let hashedPassword =  await bcrypt.hash("Sakshi@123#", 10);
 console.log(hashedPassword);
 }

 password();