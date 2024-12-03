const { responseReturn } = require("../../utiles/response");

const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const categoryModel = require("../../models/categoryModel");

class categoryController {
  add_category = async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("Formidable parsing error:", err);
        return responseReturn(res, 404, { error: "Form parsing error" });
      } else {
        let { name } = fields;
        let { image } = files;

        name = name.toString().trim();
        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.CLOUD_API_KEY,
          api_secret: process.env.CLOUD_API_SECRET,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "categorys",
          });

          if (result) {
            const category = await categoryModel.create({
              name,
              image: result.url,
              slug,
            });

            responseReturn(res, 201, {
              message: "Category added successfully",
              category,
            });
          } else {
            responseReturn(res, 400, { error: "Failed to upload image" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Intarnal server error" });
        }
      }
    });
  };

  get_category = async (req, res) => {
    const { perPage, searchValue, page } = req.query;
    // const skipPage = parseInt(perPage) * (parseInt(page) - 1);

    try {
      let skipPage = "";
      if (page && perPage) {
        skipPage = parseInt(perPage) * (parseInt(page) - 1);
      }
      if (searchValue && page && perPage) {
        const categorys = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else if (searchValue === "" && page && perPage) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });

        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { totalCategory, categorys });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}

module.exports = new categoryController();
