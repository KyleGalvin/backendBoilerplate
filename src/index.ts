import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import auth from "./controllers/auth";
import diagnostics from "./controllers/diagnostics";
import config from "./config/local";
import Bookshelf from "./models/bookshelf";
import * as SchemaBuilder from "./models/schemaBuilder";
import Logger from "./util/logger";

const logger = Logger(path.basename(__filename));

SchemaBuilder.deleteSchema().then(SchemaBuilder.buildSchema);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(auth);
app.use(diagnostics);

app.listen(3000, () => {
  logger.info("Example app listening on port 3000!");
});
