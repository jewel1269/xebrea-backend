const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEYS;
const REFRESH_SECRET = process.env.REFRESH_SECRETS;
module.exports = { SECRET_KEY, REFRESH_SECRET };
