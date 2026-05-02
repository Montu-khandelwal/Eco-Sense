const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("EcoSense backend running 🚀");
});

// ✅ ROUTES


const dashboardAnalysis = require("./routes/dashboardAnalysis");

app.use("/api/dashboard-analysis", dashboardAnalysis);

const weatherScreen = require("./routes/weather");
app.use("/api/weather", weatherScreen);

const airScreen = require("./routes/air");
app.use("/api/air", airScreen);

const wasteScreen = require("./routes/waste");
app.use("/api/waste", wasteScreen);

const waterScreen = require("./routes/water");
app.use("/api/water", waterScreen);

const chatRoute = require("./routes/chat");
app.use("/api/chat", chatRoute);

const PORT = 2000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});