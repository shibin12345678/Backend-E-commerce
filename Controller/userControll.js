const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema');
const { joiUserSchema } = require('../Models/validationSchema');



//   registration
module.exports = {
  userRegistration: async (req, res) => {
    console.log('.......');
    const { value, error } = joiUserSchema.validate(req.body);
    const { name, email, username, password } = req.body;

    if (error) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid user input ☹️. Please check your data. 🙂 ',
      });
    }

    await User.create({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    res.status(201).json({
      status: 'status',
      message: 'User registration successful',
    });
  },


//   Usre login

  userLogin: async (req, res) => {
    const { value, error } = joiUserSchema.validate(req.body);

    if (error) {
      return res.json(error.message);
    }

    const { username, password } = value;
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
       return res.status(404).json({
        status: 'error',
        message: 'User not found 🧐',
      });
    }

    if (!password || !user.password) {
      return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: 'error', message: 'Incorrect password' });
    }

      const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400,
      }
    );

    res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: token,
    });
  },
};
