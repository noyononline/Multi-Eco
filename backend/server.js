require("dotenv").config();
const express = require("express");
const { dbConnect } = require("./utiles/db");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const socket = require("socket.io");

const server = http.createServer(app);

const port = process.env.PORT || 4000;
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  },
});

let allCustomer = [];
let allSeller = [];
let admin = {};

const addUser = (customerId, socketId, userInfo) => {
  const checkUser = allCustomer.some((u) => u.customerId === customerId);

  if (!checkUser) {
    allCustomer.push({
      customerId,
      socketId,
      userInfo,
    });
  }
};

const addSeller = (sellerId, socketId, userInfo) => {
  const checkSeller = allSeller.some((u) => u.sellerId === sellerId);

  if (!checkSeller) {
    allSeller.push({
      sellerId,
      socketId,
      userInfo,
    });
  }
};

const findCustomer = (customerId) => {
  return allCustomer.find((c) => c.customerId === customerId);
};

const findSeller = (sellerId) => {
  return allSeller.find((c) => c.sellerId === sellerId);
};

const remove = (socketId) => {
  allCustomer = allCustomer.filter((c) => c.socketId !== socketId);
  allSeller = allSeller.filter((c) => c.socketId !== socketId);
};

const removeAdmin = (socketId) => {
  if (admin.socketId === socketId) {
    admin = {};
  }
};

io.on("connection", (soc) => {
  console.log("socket server is connected");

  soc.on("add_user", (customerId, userInfo) => {
    addUser(customerId, soc.id, userInfo);
    io.emit("activeCustomer", allCustomer);
    io.emit("activeSeller", allSeller);
  });
  soc.on("add_seller", (sellerId, userInfo) => {
    addSeller(sellerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
    io.emit("activeCustomer", allCustomer);
    io.emit("activeAdmin", { status: true });
  });
  soc.on("add_admin", (adminInfo) => {
    delete adminInfo.email;
    admin = adminInfo;
    admin.socketId = soc.id;
    io.emit("activeSeller", allSeller);
    io.emit("activeAdmin", { status: true });
  });
  soc.on("send_seller_message", (msg) => {
    const customer = findCustomer(msg.receverId);
    console.log(customer);

    if (customer !== undefined) {
      soc.to(customer.socketId).emit("seller_message", msg);
    }
  });
  soc.on("send_customer_message", (msg) => {
    const seller = findSeller(msg.receverId);
    console.log(seller);
    if (seller !== undefined) {
      soc.to(seller.socketId).emit("customer_message", msg);
    }
  });
  soc.on("send_message_admin_to_seller", (msg) => {
    const seller = findSeller(msg.receverId);
    console.log(seller);
    if (seller !== undefined) {
      soc.to(seller.socketId).emit("receved_admin_message", msg);
    }
  });
  soc.on("send_message_seller_to_admin", (msg) => {
    if (admin.socketId) {
      soc.to(admin.socketId).emit("receved_seller_message", msg);
    }
  });
  soc.on("disconnect", () => {
    console.log("User disconnect");
    remove(soc.id);
    removeAdmin(soc.id);
    io.emit("activeAdmin", { status: false });
    io.emit("activeCustomer", allCustomer);
    io.emit("activeSeller", allSeller);
  });
});
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/dashboard/sellerRoutes"));
app.use("/api", require("./routes/dashboard/categoryRoutes"));
app.use("/api", require("./routes/dashboard/productRoutes"));
app.use("/api/client", require("./routes/client/homeRoutes"));
app.use("/api", require("./routes/client/customerAuthRoutes"));
app.use("/api", require("./routes/client/cardRoutes"));
app.use("/api", require("./routes/order/orderRoutes"));
app.use("/api", require("./routes/client/dashboardRoutes"));
app.use("/api", require("./routes/client/chatRoutes"));
app.use("/api", require("./routes/paymentRoutes"));
app.use("/api", require("./routes/dashboard/dashboardRoutes"));
app.use("/api", require("./routes/bannerRoutes"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
dbConnect();
server.listen(port, (req, res) => {
  console.log(` server listening on ${port}`);
});
