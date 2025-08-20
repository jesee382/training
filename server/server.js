const bodyParser = require('body-parser');
const express = require('express');
var jwt = require('jsonwebtoken');
const validator= require('validator')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));


let accounts = [];

app.get('/', (req, res) => {
    res.json("Welcome to the server");
});

app.post('/register', (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    if(!username){
        return res.status(400).json("Username is required");
    }
    const usernameIsExist= accounts.find(account => account.username === username);
    if(usernameIsExist){
        return res.status(400).json("Username already exists");
    }
    if(!password){
        return res.status(400).json("Password is required");
    }
    if(!email){
        return res.status(400).json("Email is required");
    }
    if(!firstName){
        return res.status(400).json("First name is required");
    }
    if(!lastName){
        return res.status(400).json("Last name is required");
    
    }
    if(!validator.isEmail(email)){
        return res.status(400).json("Invalid email format");
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json("Password is not strong enough");
    }

    const data = {
        username,
        password,
        email,
        firstName,
        lastName
    };

    accounts.push(data);
    res.status(201).json({ message: "Account registered successfully", account: data });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json("Username is required");
    }
    if (!password) {
        return res.status(400).json("Password is required");
    }
     const usernameIsExist= accounts.find(account => account.username === username);
    if(!usernameIsExist){
        return res.status(400).json("Username does not exist");
    }
    if(usernameIsExist.password !== password){
        return res.status(400).json("Invalid password");
    }
    res.status(200).json({ message: "Login successful", account: usernameIsExist });
    
    try {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json("Internal server error");
    }
});



app.listen(8000, () => {
    console.log("Server is running on port 8000");
});