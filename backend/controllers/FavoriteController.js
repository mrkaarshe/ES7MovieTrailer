import jwt from 'jsonwebtoken'
import { User } from '../models/userSchema.js';
import bcrypt from "bcrypt";
import { Favorite } from '../models/fovirateSchema.js';
export const addTofavorite =  async (req, res) => {
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



export const getUserFov =  async (req, res) => {
  try {
    const movies = await Favorite.find({ user: req.userId });
    res.json(movies);
    console.log(movies)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const deleteUserFocv  = async (req, res) => {
  await Favorite.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted successfully" });
}

