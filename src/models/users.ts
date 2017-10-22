import Bookshelf from "./bookshelf";
import * as bcrypt from "bcrypt";
const handleCompareResponse = ((res: boolean) => {

});

const users = Bookshelf.Model.extend({
  "tableName": "users"
});

export default users;
