const { where } = require("sequelize");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bcrypt = require("bcrypt");
async function register(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            console.log("Please insert everything");
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already existed' });
        }
        const newUser = await User.create({ name, email, password, role_id: 1 });
        const userRole = await Role.findOne({ where: { id: newUser.role_id } });
        return res.status(200).json({
            message: 'User Created Successfuly',
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: userRole.name
        });


    } catch (error) {
        console.log(error);
        res.status(500).json('Error while register');
        
    }
}
module.exports = { register };