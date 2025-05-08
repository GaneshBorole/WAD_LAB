const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // for parsing application/json
const mongo_url = 'mongodb://localhost:27017/student';
// Connect to MongoDB
mongoose.connect(mongo_url)
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.log(" MongoDB connection error:", err));
// Schema and Model
const userSchema = new mongoose.Schema({
 name: String,
 age: Number,
 email: String
});

const User = mongoose.model("Profile", userSchema);
User.insertMany([{
    name:"ganesh",
    age:"21",
    email:"ganeshborole73@gmail.com"
},

    {
        name:"Mayur",
        age:"23",
        email:"mayur@gmail.com"
    },
    {
        name:"Msd",
        age:"42",
        email:"mahi11@gmail.com"
    }
    ]).then((res)=>{
        console.log(res);
    });
    


// Routes
// Default route
app.get('/', (req, res) => {
 res.send(" Express + MongoDB CRUD API running");
});


// READ: Get all users
app.get('/getData', async (_req, res) => {
 try {
 const users = await User.find();
 res.send(users);
 } catch (err) {
 res.status(500).send("Error fetching users");
 }
});



// READ: Get user by ID
app.get('/getData/:id', async (req, res) => {
    try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.send(user);
    } catch (err) {
    res.status(400).send("Invalid ID");
    }
   });



// CREATE: Add new user
app.post('/addUser', async (req, res) => {
    const { name, age, email } = req.body;
    if (!name || !age || !email) {
    return res.status(400).send("All fields are required");
    }
    try {
        const newUser = new User({ name, age, email });
        const result = await newUser.save();
        res.status(201).send(result);
        } catch (err) {
        res.status(500).send("Error adding user");
        }
       });


// UPDATE: Update user by ID
app.put('/updateUser/:id', async (req, res) => {
    const { name, age, email } = req.body;
    try {
    const result = await User.findByIdAndUpdate(
    req.params.id,
    { name, age, email },
    { new: true, runValidators: true }
    );
    if (!result) return res.status(404).send("User not found");
    res.send(result);
    } catch (err) {
    res.status(400).send("Invalid update or ID");
    }
   });
   
   // DELETE: Delete user by ID
app.delete('/deleteUser/:id', async (req, res) => {
    try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("User not found");
    res.send({ message: "User deleted", result });
    } catch (err) {
        res.status(400).send("Invalid ID");
        }
       });
       app.listen(3000, () => {
        console.log(" Server is listening on port 3000");
       });




       