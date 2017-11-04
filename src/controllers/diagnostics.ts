import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

const router = express.Router();
// respond with "hello world" when a GET request is made to the homepage
router.get("/", (req, res) => {
  res.json({"user": {
      "firstName": "Jane B",
      "lastName": "Doe",
      "avatar": "https://localhost:8080/images/avatar.jpg"
    }
  });
});

export default router;
