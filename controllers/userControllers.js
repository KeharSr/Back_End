const { response } = require("express");

const userModel = require('../models/userModel');
const { checkout } = require("../routes/userRoutes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const createUser = async (req, res) => {

    // Step 1. Check incoming data
    console.log(req.body);

    // Step 2. De-structure the incoming data
    const { firstName, lastName, email, password } = req.body;


    // Step 3. Validation (Validate the data)(if empty, stop the process and send response)
    if (!firstName || !lastName || !email || !password) {
        // res.send('Please fill all details')
        // res.status(400).json()
        return res.json({
            'sucess': false,
            'message': 'Plz enter all details!'
        })

    }



    // Step 4. Error Handling (Try Catch)
    try {
        // Step 5. Check if the user is already in the database (registered)
        const existingUser = await userModel.findOne({ email: email })

        // Step 5.1 If user Found: Send response 
        if (existingUser) {
            return res.json({
                'status': false,
                'message': 'User Already Exist!'
            })
        }
        // Step 5.1.1 Stop the process
        //Done

        // Hashing/Encryption of the password
        const randomSalt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, randomSalt)


        // Step 5.2 if user is new:
        const newUser = new userModel({
            // Database Fields : Client's Value
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hasedPassword
        })

        // Save the database
        await newUser.save()

        // Send the response
        res.json({
            'sucess': true,
            'message': 'User Created Sucesfully'
        })


        // Step 5.2.1 Hash the password
        // Step 5,2,2 Save to the database 
        // 5.2.3 Send Sucessfull response


    } catch (error) {
        console.log(error)
        res.json({
            'sucess': false,
            "message": 'Internal Server Error!'
        })

    }




}

// login Function

const loginUser = async (req, res) => {
    // res.send('Login API is working!')

    console.log(req.body)
    //Destructuring
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
        return res.json({
            'sucess': false,
            'message': 'Please enter all the fields'
        })
    }


    try {
        // find user (email)
        const user = await userModel.findOne({ email: email });
        // found data : firstName, lastname, email, password


        // not found (error message)
        if(!user){
            return res.json({
                'sucess': false,
                'message': 'User Doesnt Exist !'
            })

        }
        // Compare password (bcrypt)
        const isValidPassword = await bcrypt.compare(password,user.password)
        // not valid (error)

        if (!isValidPassword){
            return res.json({
                'sucess': false,
                'message': 'Password Doesnt Matched !'
            })

        }
        //  token (Generate - user Data + KEY)
        const token = await jwt.sign(
            {
                id : user._id   },
                process.env.JWT_SECRET

        )

        // response (token, user data)
        res.json({
            'sucess': true,
            'message': 'User Logined Sucessfully !',
            'token' : token,
            'userData' : user
        })
        


    } catch (error) {
        console.log(error)
        return res.json({
            'sucess': false,
            'message': 'Internal Server Error'
        })
    }
}

// Check incoming data



//try catch







//exporting
module.exports = {
    createUser,
    loginUser
}






