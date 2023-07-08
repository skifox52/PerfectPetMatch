import express from "express";
import "dotenv/config";
const app = express();
app.get("/", (req, res) => res.send("Hello world"));
app.listen(process.env.PORT, () => console.log(`Notification service running on port ${process.env.PORT}`));
