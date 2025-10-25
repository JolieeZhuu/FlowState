import express from "express"
import * as Google from "../controllers/googleController"

const googleRouter = express.Router();

// on start call to get google user
googleRouter.get("/", Google.startGoogleAuth);
googleRouter.get("/callback", Google.handleGoogleCallback)

// get user info
// id
googleRouter.get("/user", Google.getUserInfo)

googleRouter.post("/token", Google.verifyGoogleUser)

export default googleRouter;