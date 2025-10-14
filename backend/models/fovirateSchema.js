import mongoose from "mongoose";
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
export const Favorite = mongoose.model("Favorite", favoriteSchema);
