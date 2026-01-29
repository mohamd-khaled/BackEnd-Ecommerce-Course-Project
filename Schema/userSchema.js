const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordResetVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // Hashing password before saving user
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
