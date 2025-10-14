import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
import cors from "cors";

app.use(cors());

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ==================== MODELS ====================

// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Favorite model
const favoriteSchema = new mongoose.Schema({
  tmdbId: { type: Number },
  title: String,
  overview: String,
  release_date: String,
  poster_path: String,
  backdrop_path: String,
  popularity: Number,
  vote_average: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
favoriteSchema.index({ tmdbId: 1, user: 1 }, { unique: true }); // avoid duplicate per user
const Favorite = mongoose.model("Favorite", favoriteSchema);

// ==================== MIDDLEWARE ====================
const authMiddleware = (req, res, next) => {
  console.log("Headers:", req.headers); // <--- debug
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};



// ==================== ROUTES ====================

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Hubi haddii user horey u jiro
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
});


// Login
app.post("/api/login", async (req, res) => {
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
});


// Add favorite
app.post("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const movie = await Favorite.create({ ...req.body, user: req.userId });
    res.status(201).json(movie);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Movie already in favorites" });
    }
    res.status(400).json({ message: err.message });
  }
});

// Get user favorites
app.get("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const movies = await Favorite.find({ user: req.userId });
    res.json(movies);
    console.log(movies)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete favorite
app.delete("/api/favorites/:id", authMiddleware, async (req, res) => {
  await Favorite.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted successfully" });
});

app.get('/',(req,res)=>{
  res.send('hellooo')
})

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));