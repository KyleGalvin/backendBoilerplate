import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import auth from "./controllers/auth";
import diagnostics from "./controllers/diagnostics";
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(auth);
app.use(diagnostics);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
