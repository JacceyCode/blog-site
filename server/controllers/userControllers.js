const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const User = require("../models/userModel");
const HttpError = require("../models/errorModel");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exist", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }

    if (password != confirmPassword) {
      return next(new HttpError("Passwords do not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });

    // newUser.password = undefined;

    res.status(201).json(`New user ${newUser.email} registered.`);
  } catch (error) {
    // return next(new HttpError("User registration failed.", 402));
    return next(new HttpError(error, 402));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("User not registered.", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Wrong password.", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      //   new HttpError("Login failed. Please check your credentials.", 422)
      new HttpError(error, 422)
    );
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

exports.changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image.", 422));
    }

    // Get user from database
    const user = await User.findById(req.user.id);

    //delete old avatar if it exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    // upload avatar if none exists
    const { avatar } = req.files;
    // check file size
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture too large. SHould be less than 500kb"),
        422
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    // uploading the file
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        //Update database with file name
        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );
        if (!updatedAvatar) {
          return next(new HttpError("Avatar could not be changed.", 422));
        }

        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    // get User
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found.", 403));
    }

    // check if email doesn't already exist
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id != req.user.id) {
      return next(new HttpError("Email already exist.", 422));
    }

    //compare current password to DB password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password.", 422));
    }

    // compare new password to confirmNewPassword
    if (newPassword !== confirmNewPassword) {
      return next(new HttpError("New passwords do not match.", 422));
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(newPassword, salt);

    // update user info in DB
    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: Hash },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (err) {
    return next(new HttpError(err));
  }
};

exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    if (!authors) {
      return next(new HttpError("Authors not found.", 404));
    }

    res.status(200).json(authors);
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};
