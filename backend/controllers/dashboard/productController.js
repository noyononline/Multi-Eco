const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
class productController {
  add_product = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      console.log(fields);

      if (err) {
        console.log("Formidable parsing error:", err);
        return responseReturn(res, 404, { error: "Form parsing error" });
      } else {
        let {
          name,
          category,
          description,
          discount,
          price,
          brand,
          stock,
          shopName,
        } = fields;
        const { images } = files;

        console.log(images);

        name = name.toLocaleString().trim();
        const slug = name.split(" ").join("-");

        if (
          !name ||
          !category ||
          !description ||
          !discount ||
          !price ||
          !brand ||
          !stock
        ) {
          return responseReturn(res, 400, { error: "All fields are required" });
        }

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.CLOUD_API_KEY,
          api_secret: process.env.CLOUD_API_SECRET,
          secure: true,
        });

        try {
          let allImageUrl = [];

          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(
              images[i].filepath,
              {
                folder: "products",
              }
            );
            allImageUrl = [...allImageUrl, result.url];
            console.log(images[i].filepath);
          }

          await productModel.create({
            sellerId: id,
            name,
            slug,
            shopName,
            category: category.toString().trim(),
            description: description.toString().trim(),
            brand: brand.toString().trim(),
            stock: parseInt(stock),
            price: parseInt(price),
            discount: parseInt(discount),
            images: allImageUrl,
          });

          responseReturn(res, 200, { message: "Product added successfully" });
        } catch (error) {
          console.log(error);
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };

  get_products = async (req, res) => {
    const { perPage, searchValue, page } = req.query;
    const { id } = req;
    const skipPage = parseInt(perPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      } else {
        const products = await productModel
          .find({})
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel.find({}).countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      }
    } catch (error) {
      console.log(error);
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  get_product = async (req, res) => {
    const { productId } = req.params;

    try {
      const product = await productModel.findById(productId);

      responseReturn(res, 200, { product });
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };

  product_update = async (req, res) => {
    let { name, description, discount, price, brand, productId, stock } =
      req.body;

    name = name.toLocaleString().trim();
    const slug = name.split(" ").join("-");

    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        discount,
        price,
        brand,
        productId,
        stock,
        slug,
      });

      const product = await productModel.findById(productId);

      responseReturn(res, 200, { product, message: "product update success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      const { productId, oldImage } = field;
      const { newImage } = files;

      if (err) {
        responseReturn(res, 404, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(newImage.filepath, {
            folder: "products",
          });

          if (result) {
            let { images } = await productModel.findById(productId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = result.url;

            await productModel.findByIdAndUpdate(productId, {
              images,
            });

            const product = await productModel.findById(productId);
            responseReturn(res, 200, {
              product,
              message: "product image updated success",
            });
          } else {
            responseReturn(res, 404, { error: "image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: error.message });
        }
      }
    });
  };
}

module.exports = new productController();
