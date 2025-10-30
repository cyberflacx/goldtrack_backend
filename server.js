const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const samplesRoutes = require("./routes/samples");
require("dotenv").config();




const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/samples", samplesRoutes);
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ GoldTrack backend running on port ${PORT}`));
