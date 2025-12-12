const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./src/config/db.js");

// import routes
const medicineRoutes = require("./src/routes/medicineRoutes");
const guidesRoutes = require("./src/routes/guidesRoutes");
const alertsRoutes = require("./src/routes/alertsRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");

// middleware
const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("HealthPal API is running");
});

// ---------- ROUTES ----------
//app.use("/api/medicine/requests", medicineRoutes);

app.use("/api/medicine", medicineRoutes);
app.use("/api/guides", guidesRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/inventory", inventoryRoutes);


// ---------- MIDDLEWARE ----------
app.use(notFound);       // any wrong route
app.use(errorHandler);   // errors

// connect DB
sequelize.authenticate()
  .then(() => console.log(" Database Connected Successfully"))
  .catch((err) => console.log(" DB Connection Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
