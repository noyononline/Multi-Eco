const stripeModel = require("../../models/stripeModel");
const sellerModel = require("../../models/sellerModel");
const sellerWallet = require("../../models/sellerWallet");
const withdrowRequest = require("../../models/withdrowRequest");

const { responseReturn } = require("../../utiles/response");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const {
  mongo: { ObjectId },
} = require("mongoose");
class paymentControllers {
  create_stripe_connect_account = async (req, res) => {
    const { id } = req;
    const uid = uuidv4();

    try {
      const stripInfo = await stripeModel.findOne({ sellerId: id });
      if (stripInfo) {
        await stripeModel.deleteOne({ sellerId: id });
        const account = await stripe.accounts.create({ type: "express" });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.DASHBOARD_CLIENT_URL}/refresh`,
          return_url: `${process.env.DASHBOARD_CLIENT_URL}/success?activeCode=${uid}`,
          type: "account_onboarding",
        });
        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uid,
        });

        responseReturn(res, 201, { url: accountLink.url });
      } else {
        const account = await stripe.accounts.create({ type: "express" });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.DASHBOARD_CLIENT_URL}/refresh`,
          return_url: `${process.env.DASHBOARD_CLIENT_URL}/success?activeCode=${uid}`,
          type: "account_onboarding",
        });
        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uid,
        });
        responseReturn(res, 201, { url: accountLink.url });
      }
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  active_stripe_connect_account = async (req, res) => {
    const { activeCode } = req.params;
    console.log(activeCode);

    const { id } = req;

    try {
      const userStripeInfo = await stripeModel.findOne({ code: activeCode });
      if (userStripeInfo) {
        await sellerModel.findByIdAndUpdate(id, {
          payment: "active",
        });
        responseReturn(res, 200, { message: "payment active" });
      } else {
        responseReturn(res, 404, { message: "payment active failed" });
      }
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  sumAmount = (data) => {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      sum = sum + data[i].amount;
    }
    return sum;
  };

  get_seller_payemt_details = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const payments = await sellerWallet.find({ sellerId });

      const pendingWithdrows = await withdrowRequest.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "pending",
            },
          },
        ],
      });

      const successWithdrows = await withdrowRequest.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "success",
            },
          },
        ],
      });

      const pendingAmount = this.sumAmount(pendingWithdrows);
      const withdrowAmount = this.sumAmount(successWithdrows);
      const totalAmount = this.sumAmount(payments);

      let availableAmount = 0;

      if (totalAmount > 0) {
        availableAmount = totalAmount - (pendingAmount + withdrowAmount);
      }
      responseReturn(res, 200, {
        totalAmount,
        withdrowAmount,
        pendingAmount,
        availableAmount,
        pendingWithdrows,
        successWithdrows,
      });
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  withdrowal_request = async (req, res) => {
    const { amount, sellerId } = req.body;

    try {
      const withdrowal = await withdrowRequest.create({
        sellerId,
        amount: parseInt(amount),
      });
      responseReturn(res, 200, {
        withdrowal,
        message: "withdrowal request send",
      });
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  get_payment_request_admin = async (req, res) => {
    try {
      const withdrowalRequest = await withdrowRequest.find({
        status: "pending",
      });
      responseReturn(res, 200, { withdrowalRequest });
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  payment_request_admin_confirm = async (req, res) => {
    const { paymentId } = req.body;

    try {
      const payment = await withdrowRequest.findById(paymentId);

      if (!payment) {
        return responseReturn(res, 404, {
          message: "Payment request not found",
        });
      }

      const { stripeId } = await stripeModel.findOne({
        sellerId: new ObjectId(payment.sellerId),
      });

      // If no Stripe account found for the seller, return an error
      if (!stripeId) {
        return responseReturn(res, 404, {
          message: "Stripe account not found for seller",
        });
      }

      // Check that the payment amount is valid
      if (typeof payment.amount !== "number" || payment.amount <= 0) {
        return responseReturn(res, 400, { message: "Invalid payment amount" });
      }

      // Attempt the transfer to the seller's Stripe account
      try {
        await stripe.transfers.create({
          amount: payment.amount * 100, // Convert to cents
          currency: "usd",
          destination: stripeId, // Seller's Stripe account ID
        });
      } catch (error) {
        console.error("Stripe API Error:", error.message);
        return responseReturn(res, 500, { message: error.message });
      }

      await withdrowRequest.findByIdAndUpdate(paymentId, { status: "success" });

      responseReturn(res, 200, {
        payment,
        message: "Request confirmed successfully",
      });
    } catch (error) {
      responseReturn(res, 500, {
        message: "Internal server error",
      });
    }
  };
}

module.exports = new paymentControllers();
