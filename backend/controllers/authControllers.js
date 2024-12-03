const adminModel = require("../models/adminModel");
const { responseReturn } = require("../utiles/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { createToken } = require("../utiles/createToken");
const sellerModel = require("../models/sellerModel");
const formidable = require("formidable");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");

class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel
        .findOne({ email: email })
        .select("+password");
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          const token = await createToken({
            id: admin._id,
            role: admin.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            sameSite: "strict",
          });
          responseReturn(res, 200, { token, message: "Login successfully" });
        } else {
          responseReturn(res, 404, {
            message: "Your Email & password are incorrect",
          });
        }
      } else {
        responseReturn(res, 404, {
          message: "Your account does not exist",
        });
      }
    } catch (err) {
      responseReturn(res, 500, { err: err.message });
    }
  };

  seller_register = async (req, res) => {
    const { name, email, password } = req.body;
    // Basic validation of input data
    if (!name || !email || !password) {
      return responseReturn(res, 400, { error: "All fields are required" });
    }
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, { error: "Email already exit" });
      } else {
        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          method: "menualy",
          info: {},
        });
        console.log(seller);
        await sellerCustomerModel.create({
          myId: seller.id,
        });

        const token = await createToken({
          id: seller.id,
          role: seller.role,
        });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          sameSite: "strict",
        });

        responseReturn(res, 201, { token, message: "Register successfully" });
      }
    } catch (err) {
      responseReturn(res, 500, { err: err.message });
    }
  };

  seller_login = async (req, res) => {
    const { email, password } = req.body;
    // Basic validation of input data
    if (!email || !password) {
      return responseReturn(res, 400, { error: "All fields are required" });
    }
    try {
      const seller = await sellerModel
        .findOne({ email: email })
        .select("+password");
      if (seller) {
        const isMatch = await bcrypt.compare(password, seller.password);
        if (isMatch) {
          const token = await createToken({
            id: seller._id,
            role: seller.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: "strict",
          });
          responseReturn(res, 200, { token, message: "Login successfully" });
        } else {
          responseReturn(res, 404, {
            message: "Your Email & password are incorrect",
          });
        }
      } else {
        responseReturn(res, 404, {
          message: "Your account does not exist",
        });
      }
    } catch (err) {
      responseReturn(res, 500, { err: err.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      responseReturn(res, 200, { message: "logout success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  profile_image_upload = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
        secure: true,
      });

      const { image } = files;

      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "product",
        });
        if (result) {
          await sellerModel.findByIdAndUpdate(id, {
            image: result.url,
          });
          const userInfo = await sellerModel.findById(id);
          responseReturn(res, 201, {
            userInfo,
            message: "image upload success",
          });
        } else {
          responseReturn(res, 404, { error: "image upload failed" });
        }
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district } = req.body;
    const { id } = req;

    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName,
          division,
          district,
          sub_district,
        },
      });
      const userInfo = await sellerModel.findById(id);
      responseReturn(res, 201, { message: "Profile info added", userInfo });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;

    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel.findById(id);
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}

module.exports = new authControllers();
