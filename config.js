const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongourl: process.env.MONGO_URL,
  port: process.env.PORT,
  users_allowed_in_room: process.env.USERS_ALLOWED_IN_ROOM,
};
