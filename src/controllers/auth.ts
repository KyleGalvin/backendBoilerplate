import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import Logger from "../util/logger";

const logger = Logger(path.basename(__filename));

const router = express.Router();
router.post("/auth/signup", (req, res) => {
  logger.info("signup hit");
  res.json({"user": {
      "firstName": "Jane B",
      "lastName": "Doe",
      "avatar": "https://localhost:8080/data/avatar.jpg"
    }
  });
});

export default router;
