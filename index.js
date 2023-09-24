// RMIT University Vietnam
// Course: COSC2430 Web Programming
// Semester: 2023A
// Assessment: Assignment 2
// Author: Nguyen Dung Tri
// ID: S3979077
// Acknowledgement: Acknowledge the resources that you use here.
var express=require("express");
var bodyParse=require("body-parser");
var mongoose=require("mongoose");

const app=express()

app.use(bodyParse.json())
app.use(express.static('public'))
app.use(bodyParse.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://yabokugamiyt:Yaboku-gami2004@cluster1.e7c68ur.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
 var db = mongoose.connection

 db.on('error',()=> console.log("error in connecting database"));
 db.once('open',()=> console.log("Connected to database"));

 app.get("/", (req,res)=>{
    return res.redirect("index.html");
 })
 .listen(3000);

 app.post('/login', async (req, res) => {
    try {
      // Get the username and password from the request body
      const username = req.body.username;
      const password = req.body.password;
  
      // Check the username and password against the vendor collection
      const vendor = await db.collection('vendor').findOne({ email: username });
      if (vendor && vendor.password === password) {
        // Login success
        console.log('Login success');
        return res.redirect('vendor.html');
      }
  
      // Check the username and password against the shipper collection
      const shipper = await db.collection('shipper').findOne({ email: username });
      if (shipper && shipper.password === password) {
        // Login success
        console.log('Login success');
        return res.redirect('shipper.html');
      }
  
      // Check the username and password against the customer collection
      const customer = await db.collection('customer').findOne({ email: username });
      if (customer && customer.password === password) {
        // Login success
        console.log('Login success');
        return res.redirect('Customer.html');
      }
  
      // Login failed
      console.log('Login failed');
      return res.redirect('index.html');



      
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  });

  app.post("/sign_up_vendor", (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    var businessName = req.body.businessName;
    var businessAddress = req.body.businessAddress;
    var profilePicture = req.body.profilePicture;
  
    // Validate the username.
    if (!validateUsername(username)) {
      // Return an error message.
      return res.json({
        error: "Invalid username, please rollback.",
      });
    }
  
    // Validate the password.
    if (!validatePassword(password)) {
      // Return an error message.
      return res.json({
        error: "Invalid password, please rollback.",
      });
    }
  
    // Insert the vendor data into the database.
    db.collection('vendor').insertOne({
      username,
      email,
      phno,
      password,
      businessName,
      businessAddress,
      profilePicture,
    }, (err, collection) => {
      if (err) throw err;
      console.log("Record Inserted Successfully");
    });
  
    // Redirect the user to the signup success page.
    return res.redirect('signup_success.html');
  });

app.post("/sign_up_shipper", (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    var shipperName = req.body.shipperName;
    var DistributionHub = req.body.DistributionHub;
    var profilePicture = req.body.profilePicture;
    
    // Validate the username.
    if (!validateUsername(username)) {
        // Return an error message.
        return res.json({
          error: "Invalid username, please rollback.",
        });
      }
    
      // Validate the password.
      if (!validatePassword(password)) {
        // Return an error message.
        return res.json({
          error: "Invalid password, please rollback.",
        });
      }
    
      // Insert the vendor data into the database.
      db.collection('shipper').insertOne({
        username,
        email,
        phno,
        password,
        shipperName,
        DistributionHub,
        profilePicture,
      }, (err, collection) => {
        if (err) throw err;
        console.log("Record Inserted Successfully");
      });
    
      // Redirect the user to the signup success page.
      return res.redirect('signup_success.html');
})

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');

})

app.post("/sign_up_customer", (req, res) => {
    var username = req.body.username;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    var Address = req.body.Address;
    var profilePicture = req.body.profilePicture;
    // Validate the username.
    if (!validateUsername(username)) {
        // Return an error message.
        return res.json({
          error: "Invalid username, please rollback.",
        });
      }
    
      // Validate the password.
      if (!validatePassword(password)) {
        // Return an error message.
        return res.json({
          error: "Invalid password, please rollback.",
        });
      }
    
      // Insert the vendor data into the database.
      db.collection('customer').insertOne({
        username,
        email,
        phno,
        password,
        Address,
        profilePicture,
      }, (err, collection) => {
        if (err) throw err;
        console.log("Record Inserted Successfully");
      });
    
      // Redirect the user to the signup success page.
      return res.redirect('signup_success.html');

})

function validateUsername(username) {
    // Check if the username is empty.
    if (username === '') {
      return false;
    }
  
    // Check if the username contains only letters and digits.
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return false;
    }
  
    // Check if the username is between 8 and 15 characters long.
    if (username.length < 8 || username.length > 15) {
      return false;
    }
  
    // Check if the username is unique.
    // You can do this by querying your database for a vendor with the same username.
    // If there is a vendor with the same username, return false.
  
    return true;
  }

  function validatePassword(password) {
    // Check if the password is empty.
    if (password === '') {
      return false;
    }
  
    // Check if the password contains at least one uppercase letter, at least one lowercase letter, at least one digit, and at least one special character.
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      return false;
    }
  
    // Check if the password does not contain any other kinds of characters.
    if (/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
      return false;
    }
  
    // Check if the password is between 8 and 20 characters long.
    if (password.length < 8 || password.length > 20) {
      return false;
    }
  
    return true;
  }