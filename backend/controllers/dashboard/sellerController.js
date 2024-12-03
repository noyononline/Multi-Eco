const sellerModel = require("../../models/sellerModel");
const { responseReturn } = require("../../utiles/response");

class sellerController {
  get_seller_request = async (req, res) => {
    const { page, searchValue, perpage } = req.body;
    const skipPage = parseInt(perpage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        // const seller
      } else {
        const sellers = await sellerModel
          .find({ status: "pending" })
          .skip(skipPage)
          .limit(perpage)
          .sort({ createdAt: -1 });
        const totalSeller = await sellerModel
          .find({ status: "pending" })
          .countDocuments();
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_get = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const seller = await sellerModel.findById(sellerId);
      responseReturn(res, 200, { seller });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_status_update = async (req, res) => {
    const { sellerId, status } = req.body;

    try {
      await sellerModel.findByIdAndUpdate(sellerId, { status });
      const seller = await sellerModel.findById(sellerId);
      responseReturn(res, 200, { seller, message: "seller status updated" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_active_sellers = async (req, res) => {
    let { page, searchValue, perPage } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);

    const skipPage = perPage * (page - 1);

    try {
      if (searchValue) {
        const sellers = await sellerModel
          .find({
            $text: { $search: searchValue },
            status: "active",
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalSeller = await sellerModel
          .find({
            $text: { $search: searchValue },
            status: "active",
          })
          .countDocuments();

        responseReturn(res, 200, { totalSeller, sellers });
      } else {
        const sellers = await sellerModel
          .find({ status: "active" })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalSeller = await sellerModel
          .find({ status: "active" })
          .countDocuments();
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_deactive_sellers = async (req, res) => {
    let { page, searchValue, perPage } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);

    const skipPage = perPage * (page - 1);

    try {
      if (searchValue) {
        const sellers = await sellerModel
          .find({
            $text: { $search: searchValue },
            status: "deactive",
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalSeller = await sellerModel
          .find({
            $text: { $search: searchValue },
            status: "deactive",
          })
          .countDocuments();

        responseReturn(res, 200, { totalSeller, sellers });
      } else {
        const sellers = await sellerModel
          .find({ status: "deactive" })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalSeller = await sellerModel
          .find({ status: "deactive" })
          .countDocuments();
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}
module.exports = new sellerController();
