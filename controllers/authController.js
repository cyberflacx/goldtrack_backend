const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET = process.env.JWT_SECRET || "goldtrack_secret";
const ADMIN_KEY = process.env.ADMIN_KEY || "ZXCV1234IT";

exports.register = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    // 🔐 Check admin key first
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: "Unauthorized: Invalid admin key" });
    }

    const newUser = await User.register(email, password);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err });
  }
};
