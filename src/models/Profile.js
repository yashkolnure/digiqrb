import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // 👤 OWNER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔗 UNIQUE IDENTITY
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    // 🧠 BASIC INFO
    name: {
      type: String,
      trim: true
    },

    bio: {
      type: String,
      maxlength: 300
    },

    profileImage: {
      type: String,
      default: ""
    },

    banner: {
      type: String,
      default: ""
    },

    // 📞 CONTACT INFO (ALL OPTIONAL)
    phone: String,
    email: String,
    website: String,
    location: String,

    // 🌐 SOCIAL LINKS (OPTIONAL)
    social: {
      instagram: String,
      linkedin: String,
      twitter: String,
      youtube: String,
      whatsapp: String
    },

    // 🔗 CUSTOM LINKS
    links: [
      {
        title: {
          type: String,
          trim: true
        },
        url: String,
        clicks: {
          type: Number,
          default: 0
        },
        featured: {
          type: Boolean,
          default: false
        }
      }
    ],

    // 🧩 OPTIONAL SECTIONS

    // 💼 SERVICES
    services: [
      {
        title: String,
        description: String
      }
    ],

    // 🧑‍💼 PORTFOLIO
    portfolio: [
      {
        title: String,
        link: String,
        image: String
      }
    ],

    // ⭐ TESTIMONIALS
    testimonials: [
      {
        name: String,
        text: String,
        rating: Number
      }
    ],

    // 🧲 LEAD CAPTURE SYSTEM
    enableContactForm: {
      type: Boolean,
      default: false
    },

    leads: [
      {
        name: String,
        email: String,
        phone: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // 🎨 UI / THEMES
    theme: {
      type: String,
      default: "default"
    },

    // 📊 ANALYTICS
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);