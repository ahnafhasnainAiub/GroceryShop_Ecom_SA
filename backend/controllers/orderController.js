import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import CONSTANTS from "../const/CONSTANTS.js";

// @desc     Create new order
// @method   POST
// @endpoint /api/v1/orders
// @access   Private
const addOrderItems = async (req, res, next) => {
  try {
    const { cartItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    // console.log(cartItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice);
    if (!cartItems || cartItems.length === 0) {
      res.statusCode = 400;
      throw new Error("No order items.");
    }

    const order = new Order({
      user: req.user._id,
      orderItems: cartItems.map((item) => ({
        ...item,
        product: item._id,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      isPaid: paymentMethod == "Cash on Delivery" ? false : true,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    const productId = createdOrder.orderItems[0]._id;
    const productCount = createdOrder.orderItems[0].qty;

    // update product quantity
    const productToUpdateQty = await Product.findById(productId);
    productToUpdateQty.countInStock = productToUpdateQty.countInStock - productCount;
    const newProdQty = await productToUpdateQty.save();

    console.log(newProdQty);

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Get logged-in user orders
// @method   GET
// @endpoint /api/v1/orders/my-orders
// @access   Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
      res.statusCode = 404;
      throw new Error("No orders found for the logged-in user.");
    }

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc     Get order by ID
// @method   GET
// @endpoint /api/v1/orders/:id
// @access   Private
const getOrderById = async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      res.statusCode = 404;
      throw new Error("Order not found!");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to paid
// @method   PUT
// @endpoint /api/v1/orders/:id/pay
// @access   Private
const updateOrderToPaid = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error("Order not found!");
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.updateTime,
      email_address: req.body.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to delivered
// @method   PUT
// @endpoint /api/v1/orders/:id/deliver
// @access   Private/Admin
const updateOrderToDeliver = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      res.statusCode = 404;
      throw new Error("Order not found!");
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedDeliver = await order.save();

    res.status(200).json(updatedDeliver);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to delivered
// @method   PUT
// @endpoint /api/v1/orders/:id/return
// @access   Private/Admin
const returnOrder = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const { id: orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error("Order not found!");
    }

    // Check if the payment was made more than 15 minutes ago
    const orderCreatedAt = new Date(order.createdAt);
    const timeDifference = Math.abs(currentDate - orderCreatedAt); // Difference in milliseconds
    const minutesDifference = Math.floor(timeDifference / (1000 * 60)); // Convert to minutes

    if (minutesDifference > CONSTANTS.return_time) {
      res.status(400);
      throw new Error(`You cannot return the order after ${CONSTANTS.return_time} minutes of purchase.`);
    }

    // If within {CONSTANTS.return_time} minutes, return the order
    order.isReturned = true;
    await order.save();

    res.status(200).json({ message: "Order successfully returned!" });
  } catch (error) {
    next(error);
  }
};

// @desc     Get all orders
// @method   GET
// @endpoint /api/v1/orders
// @access   Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "id name");

    if (!orders || orders.length === 0) {
      res.statusCode = 404;
      throw new Error("Orders not found!");
    }
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};



  

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, returnOrder, updateOrderToDeliver, getOrders};
