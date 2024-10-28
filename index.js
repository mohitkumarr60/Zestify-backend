import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import menuRouter from "./routes/menu.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/category.route.js";

main().catch((err) => console.log(err));

// database connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/zestify");
  console.log("Connected to MongoDB");
}

const app = express();
const port = 5000;

// cross origin resource sharing
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Zestify server listening on port http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Connected to Zestify Server!");
});

app.use("/api", menuRouter, userRouter, categoryRouter);
