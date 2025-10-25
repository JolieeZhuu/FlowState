import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import passport from "./config/passport";

import mongoRouter from "./routes/mongoRoute";
import googleRouter from "./routes/googleRoute";
import geminiRouter from "./routes/geminiRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());


app.use("/google", googleRouter)
app.use("/database", mongoRouter)
app.use("/gemini", geminiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});