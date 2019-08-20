const { User } = require("../models/user");

const getUser = async id => {
  try {
    const user = await User.findById(id, { username: 1, thumbnail: 1, role: 1, strategy: 1 });
    return user;
  } catch (err) {
    throw new Error("Could not connect to Database. Please try again later");
  }
};

module.exports = {
  getUser,
};
