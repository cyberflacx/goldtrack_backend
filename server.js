const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const samplesRoutes = require("./routes/samples");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

// ✅ Proper CORS setup (Render + local)
app.use(
  cors({
    origin: [
      "https://goldtrack-frontend.onrender.com", // your Flutter web app
      "http://localhost:8080", // local test
      "http://localhost:5000", // backend local test
      "http://127.0.0.1:5000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// ✅ Routes
app.use("/api/samples", samplesRoutes);
app.use("/api/auth", authRoutes);

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ GoldTrack backend running on port ${PORT}`));
