const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/students");

console.log("studentroutes load successfully");

app.get("/", (req, res) => {
res.json({
message: "Student Management API is running!"
});
});

app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log("Server running at http://localhost:5000");
});