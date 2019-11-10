const { User } = require("../models/user");

const getUser = async id => {
  try {
    return await User.findById(id, { username: 1, thumbnail: 1, role: 1, strategy: 1 });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
};

const getAllUsers = async () => {
  try {
    return await User.find({}, { username: 1, thumbnail: 1, role: 1 });
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

const changeUserRole = async id => {
  try {
    const user = await User.findById(id);
    if (user.role === "Admin") {
      user.role = "Reader";
    } else {
      user.role = "Admin";
    }
    user.save();
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later.");
  }
};

module.exports = {
  getUser,
  getAllUsers,
  changeUserRole,
};
