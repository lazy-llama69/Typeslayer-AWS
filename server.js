import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// Define a schema for leaderboard
const leaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: String, required: true },
});

// Create a model
const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);


// Routes
// Fetch leaderboard data
app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(10); // Top 10 players
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Endpoint to update leaderboard
app.post("/leaderboard", async (req, res) => {
  const { username, score } = req.body;
  if (!username || !score) {
    return res.status(400).json({ message: "Name and score are required!" });
  }
  try {
    // Check if player already exists
    const existingPlayer = await Leaderboard.findOne({ username });
    
    if (existingPlayer) {
      // If player exists, update the score
      existingPlayer.score = Math.max(existingPlayer.score, score); // Update only if the new score is higher
      await existingPlayer.save();
      return res.json(existingPlayer);
    } else {
      // If player doesn't exist, create a new entry
      const newPlayer = new Leaderboard({ username, score });
      await newPlayer.save();
      return res.status(201).json(newPlayer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update leaderboard" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
