const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, require: true},
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    phone: { type: Number, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
