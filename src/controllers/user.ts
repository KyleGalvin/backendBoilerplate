import * as express from "express";
import * as jwt from "express-jwt";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import {config} from "../config";

const router = express.Router();

router.get("/user",
  jwt({secret: config.jwt.secret}),
  (req, res) => {
    res.json({"user": {
      "firstName": "Jane B",
      "lastName": "Doe",
      "avatar": "/images/avatar.jpg"
      }
    });
});

export default router;
