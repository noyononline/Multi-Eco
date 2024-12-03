const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const queryProducts = require("../../utiles/queryProducts");
const { responseReturn } = require("../../utiles/response");
const reviewModel = require("../../models/reviewModel");
const moment = require("moment");
const {
  mongo: { ObjectId },
} = require("mongoose");
class homeControllers {
  formateProduct = (products) => {
    const productArray = [];
    for (let i = 0; i < products.length; i += 3) {
      productArray.push(products.slice(i, i + 3));
    }
    return productArray;
  };
  get_categorys = async (req, res) => {
    try {
      const categorys = await categoryModel.find({});
      responseReturn(res, 200, { categorys });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_products = async (req, res) => {
    try {
      const products = await productModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(12);

      // Format the products into groups of 3
      const latest_products = this.formateProduct(products.slice(0, 9));
      const topRated_products = this.formateProduct(
        [...products].sort((a, b) => b.rating - a.rating).slice(0, 9)
      );
      const discount_products = this.formateProduct(
        [...products].sort((a, b) => b.discount - a.discount).slice(0, 9)
      );

      const main_products = products.slice(0, 16); // Modify this as needed

      responseReturn(res, 200, {
        products: main_products,
        latest_products,
        topRated_products,
        discount_products,
      });
    } catch (error) {
      console.error(error);
    }
  };

  price_range_product = async (req, res) => {
    try {
      const priceRange = {
        low: 0,
        high: 0,
      };
      const products = await productModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(9);
      const latest_products = this.formateProduct(products);
      const getForPrice = await productModel.find({}).sort({ price: 1 });

      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }

      responseReturn(res, 200, { latest_products, priceRange });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  query_products = async (req, res) => {
    const perPage = 3;
    req.query.perPage = perPage;

    try {
      const products = await productModel.find({}).sort({ createdAt: -1 });
      const totalProduct = new queryProducts(products, req.query)
        .categoryQuery()
        .priceQuery()
        .ratingQuery()
        .sortByPrice()
        .searchQuery()
        .countProducts();

      const result = new queryProducts(products, req.query)
        .categoryQuery()
        .ratingQuery()
        .priceQuery()
        .searchQuery()
        .sortByPrice()
        .skip()
        .limit()
        .getProducts();

      responseReturn(res, 200, { products: result, totalProduct, perPage });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_product_details = async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await productModel.findOne({ slug });
      const relatedProducts = await productModel
        .find({
          $and: [
            {
              _id: {
                $ne: product.id,
              },
            },
            {
              category: {
                $eq: product.category,
              },
            },
          ],
        })
        .limit(12);
      const moreProducts = await productModel
        .find({
          $and: [
            {
              _id: {
                $ne: product.id,
              },
            },
            {
              sellerId: {
                $eq: product.sellerId,
              },
            },
          ],
        })
        .limit(3);
      responseReturn(res, 200, { product, relatedProducts, moreProducts });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  customer_review = async (req, res) => {
    const { name, rating, review, productId } = req.body;

    try {
      await reviewModel.create({
        productId,
        name,
        rating,
        review,
        date: moment(Date.now()).format("LL"),
      });

      let rat = 0;
      const reviews = await reviewModel.find({ productId });

      for (let i = 0; i < reviews.length; i++) {
        rat = rat + reviews[i].rating;
      }

      let productRating = 0;
      if (reviews.length !== 0) {
        productRating = (rat / reviews.length).toFixed(1);
      }

      await productModel.findByIdAndUpdate(productId, {
        rating: productRating,
      });

      responseReturn(res, 201, { message: "Review Success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_reviews = async (req, res) => {
    const { productId } = req.params;
    let { pageNo } = req.query;

    pageNo = parseInt(pageNo);
    const limit = 5;
    const skipPage = limit * (pageNo - 1);

    try {
      let getRating = await reviewModel.aggregate([
        {
          $match: {
            productId: new ObjectId(productId),
            rating: { $exists: true, $ne: 0 }, // Make sure rating exists
          },
        },
        {
          $unwind: "$rating",
        },
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      console.log("Aggregated Ratings:", getRating);
      const rating_review = [
        { rating: 5, sum: 0 },
        { rating: 4, sum: 0 },
        { rating: 3, sum: 0 },
        { rating: 2, sum: 0 },
        { rating: 1, sum: 0 },
        { rating: 0, sum: 0 },
      ];

      for (let i = 0; i < rating_review.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
          if (rating_review[i].rating === getRating[j]._id) {
            rating_review[i].sum = getRating[j].count;
            break;
          }
        }
      }
      console.log("Final Rating Review Data:", rating_review);
      const getAll = await reviewModel.find({ productId });
      console.log("Total Reviews Count:", getAll.length);

      const reviews = await reviewModel
        .find({ productId })
        .skip(skipPage)
        .limit(limit)
        .sort({ createdAt: -1 });

      console.log("Paginated Reviews:", reviews);

      responseReturn(res, 200, {
        reviews,
        totalReview: getAll.length,
        rating_review,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new homeControllers();
