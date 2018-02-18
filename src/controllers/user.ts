import * as express from "express";

import {config} from "../config";

const router = express.Router();

router.get("/user",
  (req, res) => {
    res.json({"user": {
      "firstName": "Jane B",
      "lastName": "Doe",
      "avatar": "/images/avatar.jpg"
      }
    });
});

export default router;
