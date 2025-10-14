import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
export const register = async (req, res) =>{
      try {
    const { name, email, password } = req.body;
    

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
    console.log("REQ BODY:", req.body);

  }
}



export const login  = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}