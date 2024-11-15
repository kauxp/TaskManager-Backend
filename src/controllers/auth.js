import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({message: "User already exists"});
        else{

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({name: name, email: email, password: hashedPassword, role:role});

            await user.save();
            return res.status(201).json({message: "User created successfully"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error: ", error});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({message: "User does not exist"});
        else {
            const match = await bcrypt.compare(password, user.password);

            if(!match) return res.status(400).json({message: "Invalid credentials"});
            else {
                const payload = {id: user._id, role:user.role};
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});
                return res.status(200).json({message: "logged in successfully"});
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error: ", error});
    }
}
