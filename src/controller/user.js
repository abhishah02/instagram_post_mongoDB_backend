const { sign } = require("jsonwebtoken");
const User = require("../modal/user");
const { v4 } = require("uuid");

async function register(req, res) {
  try {
    const { first_name, last_name, phone, email, password } = req.body;

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).json({ msg: "User Already Exist. Please Login" });
    }
    const insert = await User.create({
      user_id: v4(),
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      email: email,
      password: password,
    });
    // console.log(insert);

    return res.json({ st: true, msg: "success" });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // console.log(username, password);
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (user === null) {
      return res.json({
        st: true,
        msg: "User Not Register",
      });
    }
    const pass = await User.findOne({ password: password });
    // console.log(pass);

    if (pass === null) {
      return res.json({
        st: true,
        msg: "Password Not match or invalid",
      });
    }

    const jwtSecretKey = process.env.SECRET;
    const token = sign(
      { id: pass.user_id, name: pass.first_name + pass.last_name },
      jwtSecretKey,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      st: true,
      msg: "Login Succcessfully",
      uid: user.user_id,
      token: token,
    });
  } catch (err) {
    return res.json({
      st: true,
      msg: err.message,
    });
  }
}

const user = { register, login };

module.exports = user;
