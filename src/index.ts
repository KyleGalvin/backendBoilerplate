import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";


import auth from "./controllers/auth";
import diagnostics from "./controllers/diagnostics";
import config from "./config/local";

import Bookshelf from "./models/bookshelf";
import * as SchemaBuilder from "./models/schemaBuilder";



SchemaBuilder.deleteSchema().then(SchemaBuilder.buildSchema);


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(auth);
app.use(diagnostics);

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
