const { response } = require("express");

const userModel = require('../models/userModel');
const { checkout } = require("../routes/userRoutes");
const bcrypt = require('bcrypt');


const createUser = async (req, res) => {

    // Step 1. Check incoming data
    console.log(req.body);

    // Step 2. De-structure the incoming data
    const{firstName, lastName, email, password} = req.body;


    // Step 3. Validation (Validate the data)(if empty, stop the process and send response)
    if(!firstName || !lastName || !email || !password){
        // res.send('Please fill all details')
        // res.status(400).json()
        return res.json({
            'sucess' : false,
            'message' : 'Plz enter all details!'
        })

    }



    // Step 4. Error Handling (Try Catch)
    try {
    // Step 5. Check if the user is already in the database (registered)
    const existingUser = await userModel.findOne({email : email})
   
    // Step 5.1 If user Found: Send response 
     if(existingUser){
        return res.json ({
            'status' : false,
            'message' : 'User Already Exist!'
        })
     }
    // Step 5.1.1 Stop the process
    //Done

    // Hashing/Encryption of the password
    const randomSalt =  await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password,randomSalt)


    // Step 5.2 if user is new:
    const newUser = new userModel({
        // Database Fields : Client's Value
        firstName : firstName,
        lastName : lastName,
        email :  email,
        password : hasedPassword
    })

    // Save the database
    await newUser.save()

    // Send the response
    res.json({
        'sucess' : true,
        'message' : 'User Created Sucesfully' 
    })


    // Step 5.2.1 Hash the password
    // Step 5,2,2 Save to the database 
    // 5.2.3 Send Sucessfull response

        
    } catch (error) {
        console.log(error)
        res.json({
            'sucess' : false,
            "message" : 'Internal Server Error!'
        })
        
    }
    

   

}






//exporting
module.exports = {
    createUser
}






// Logic for login

// 1. Check incoming data
// 2. De-Structure the incoming data
// 3. Validation
// 4. Error Handling(Try catch)
// 5. Check if the user is  login with the valid email and password
// 5.1 If user found: Send response
// 5.2 Stop the process

// const login = async (req, res) => {
//     const { email, password } = req.body
  
//     if (!email && !password ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Fill in all the required fields" })
//     }
//     try {
//       const userExists = await User.findOne({ email:email ,password:password })
//       if (!userExists) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid email or password" })
//       } else {
//         return res
//           .status(200)
//           .json({ success: true, message: "Logged in successfull!" })
//       }
//     } catch (error) {
//       res
//         .status(500)
//         .json({ success: false, message: "Internal server error" })
//   }
//   }



// user check
// password validation
// session 
// token
// cookies