import Profile from "../models/Profile.js";


// 🧼 CLEAN ARRAY HELPER
const cleanArray = (arr) =>
  (arr || []).filter((item) =>
    Object.values(item).some((v) => v && v !== "")
  );


// CREATE OR UPDATE PROFILE
export const saveProfile = async (req, res) => {
  try {
    let {
      username,
      name,
      bio,
      profileImage,
      banner,

      phone,
      email,
      website,
      location,

      social,
      links,

      services,
      portfolio,
      testimonials,

      enableContactForm,
      theme
    } = req.body;

    // 🔤 sanitize username
    username = username?.toLowerCase().trim();

    if (!username || !username.match(/^[a-z0-9_]+$/)) {
      return res.status(400).json({
        msg: "Username must be lowercase, no spaces"
      });
    }

    // 🔍 check uniqueness
    const existing = await Profile.findOne({ username });

    if (existing && existing.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    // 🧼 clean arrays
    const cleanedLinks = cleanArray(links);
    const cleanedServices = cleanArray(services);
    const cleanedPortfolio = cleanArray(portfolio);
    const cleanedTestimonials = cleanArray(testimonials);

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // 🔄 UPDATE

      profile.username = username;
      profile.name = name;
      profile.bio = bio;

      profile.profileImage = profileImage;
      profile.banner = banner;

      profile.phone = phone;
      profile.email = email;
      profile.website = website;
      profile.location = location;

      profile.social = social || {};

      // preserve clicks
      profile.links = cleanedLinks.map((link, i) => ({
        ...link,
        clicks: profile.links?.[i]?.clicks || 0
      }));

      profile.services = cleanedServices;
      profile.portfolio = cleanedPortfolio;
      profile.testimonials = cleanedTestimonials;

      profile.enableContactForm = !!enableContactForm;
      profile.theme = theme || "default";

      await profile.save();

    } else {
      // 🆕 CREATE

      profile = await Profile.create({
        user: req.user.id,
        username,
        name,
        bio,
        profileImage,
        banner,

        phone,
        email,
        website,
        location,

        social: social || {},

        links: cleanedLinks,

        services: cleanedServices,
        portfolio: cleanedPortfolio,
        testimonials: cleanedTestimonials,

        enableContactForm: !!enableContactForm,
        theme: theme || "default"
      });
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// GET MY PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    res.json(profile || null);

  } catch (err) {
    res.status(500).json(err);
  }
};



// GET PUBLIC PROFILE
export const getProfileByUsername = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      username: req.params.username.toLowerCase()
    });

    if (!profile) {
      return res.status(404).json({ msg: "Not found" });
    }

    // 📊 increment views
    profile.views = (profile.views || 0) + 1;
    await profile.save();

    res.json(profile);

  } catch (err) {
    res.status(500).json(err);
  }
};



// 🔗 TRACK LINK CLICK
export const trackLinkClick = async (req, res) => {
  try {
    const { username, index } = req.body;

    const profile = await Profile.findOne({
      username: username.toLowerCase()
    });

    if (!profile) {
      return res.status(404).json({ msg: "Not found" });
    }

    if (!profile.links[index]) {
      return res.status(400).json({ msg: "Invalid link index" });
    }

    profile.links[index].clicks =
      (profile.links[index].clicks || 0) + 1;

    await profile.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json(err);
  }
};



// 📩 SAVE LEAD (CONTACT FORM)
export const saveLead = async (req, res) => {
  try {
    const { username, name, email, phone, message } = req.body;

    const profile = await Profile.findOne({
      username: username.toLowerCase()
    });

    if (!profile) {
      return res.status(404).json({ msg: "Not found" });
    }

    if (!profile.enableContactForm) {
      return res.status(400).json({ msg: "Contact form disabled" });
    }

    profile.leads.push({ name, email, phone, message });

    await profile.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json(err);
  }
};