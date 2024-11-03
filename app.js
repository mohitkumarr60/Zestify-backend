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
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");
}

const app = express();
const PORT = process.env.PORT || 5000;

// cross origin resource sharing
app.use(
  cors({
    origin: ["https://zestify-qx04ngreq-mohitkumarr60s-projects.vercel.app/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Zestify server listening on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Connected to Zestify Server!");
});

app.use("/api", menuRouter, userRouter, categoryRouter);
