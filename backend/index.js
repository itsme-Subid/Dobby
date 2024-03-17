import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import usersRoute from "./routes/users.js";
import imagesRoute from "./routes/images.js";
dotenv.config();

connectToMongo();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// routes
app.use("/api/users", usersRoute);
app.use("/api/images", imagesRoute);

app.get("/", (req, res) => {
  res.send({
    message: "Express.js server is working!",
    request: req.body,
  });
});

app.listen(port, () => {
  console.log(`Express.js: Listening at port: ${port}`);
});
