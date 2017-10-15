import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

const router = express.Router();
router.post("/auth/signup", (req, res) => {
  console.log("signup hit");
  res.json({"user": {
      "firstName": "Jane B",
      "lastName": "Doe",
      "avatar": "http://localhost:8080/dist/data/avatar.jpg"
    }
  });
});

export default router;
