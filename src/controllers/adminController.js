import User from "../models/User.js";
import Profile from "../models/Profile.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const profiles = await Profile.find();

    const data = users.map((user) => {
      const profile = profiles.find(
        (p) => p.user.toString() === user._id.toString()
      );

      return {
        userId: user._id,
        email: user.email,
        phone: user.phone,

        username: profile?.username || "",
        name: profile?.name || "",
        plan: user.plan || "free",

        views: profile?.views || 0,
        leads: profile?.leads?.length || 0,

        profileLink: profile
          ? `${process.env.FRONTEND_URL}/${profile.username}`
          : ""
      };
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};