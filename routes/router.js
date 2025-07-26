const express = require('express');
const router = express.Router();
const User = require('../model/Register'); // Import the User model
// Route to handle user registration
const Products =require("../model/product");
const OrderCart =require("../model/OrderCart");
const Shopkeeper =require("../model/ShopDetails");
const Message =require("../model/messages");
const nodemailer=require("nodemailer");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cloudinary = require('../config/Cloudinary');
const moment = require('moment');
const axios=require('axios')
const multer = require('multer');
const multer = require('cors');
const path=require('path');
require('dotenv').config();

app.use(cors({
  origin: 'https://dapper-chaja-9ec520.netlify.app',
  credentials: true, 
}));
const { OAuth2Client } = require('google-auth-library');


// Multer file filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("1");
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle login for both users and shopkeepers
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check in the Shopkeeper database
    let shopkeeper = await Shopkeeper.findOne({ email });

    if (shopkeeper) {
      // If found in the shopkeeper database, check the password
      if (shopkeeper.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials for shopkeeper' });
      }
      // If the password matches, return the response with a flag indicating the user is a shopkeeper
      return res.status(200).json({ message: 'Shopkeeper logged in successfully', userType: 'shopkeeper', shopkeeper });
    }

    // If not found in the Shopkeeper database, check in the User database
    let user = await User.findOne({ email });

    if (user) {
      // If found in the user database, check the password
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials for user' });
      }
      // If the password matches, return the response with a flag indicating the user is a regular user
      return res.status(200).json({ message: 'User logged in successfully', userType: 'user', user });
    }

    // If the email is not found in both databases, return an error
    return res.status(400).json({ message: 'Email not registered as user or shopkeeper' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/categories', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Products.find();

    // Extract unique categories and their images
    const categories = products.reduce((acc, product) => {
      if (!acc.some(cat => cat.category === product.category)) {
        acc.push({ category: product.category, categoryImage: product.categoryImage });
      }
      return acc;
    }, []);

    // Send the unique categories with images to the client
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});


router.get('/products',async  (req, res) => {
  const products=await Products.find({});
  const productDetails = products.map(product => ({
    id:product.id,
    name: product.name,
    price: product.price,
    image: product.image
  }));

  res.json(productDetails);
});

router.get('/products1', async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Products.find({ category }).exec();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cart', async (req, res) => {
  const { email, productId, quantity} = req.body; // Include price

  try {
    console.log('Request received with:', { email, productId, quantity });

    // Find or create the user
    let user = await OrderCart.findOne({ emailAddress: email }); // Use emailAddress as per the schema

    if (!user) {
      user = new OrderCart({ emailAddress: email, carts: [] });
    }

    // Find existing cart item
    const existingCartItem = user.carts.find(item => item.productId === productId);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      // Push the new cart item, include price
      user.carts.push({ productId, quantity });
    }

    console.log('Saving user cart data...');
    
    await user.save();
    console.log('User cart saved successfully');
    res.status(200).json({ message: 'Item added to cart successfully.' });

  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ message: error.message });
  }
});



router.post('/orders', async (req, res) => {
  const { email, productId, quantity, totalPrice } = req.body;
  console.log(email);
  console.log(productId);
  console.log(quantity);
  console.log(totalPrice);

  try {
    // Find or create the user
    let user = await OrderCart.findOne({ emailAddress: email });

    if (!user) {
      user = new OrderCart({ emailAddress: email, orders: [], carts: [] });
    }

    // Add the order
    user.orders.push({ productId, quantity, totalPrice });

    // Optionally, remove the item from the cart after placing the order
    user.carts = user.carts.filter(item => item.productId !== productId);

    // Find the product and update its stock
    const product = await Products.findOne({ id: productId });
  console.log("1");
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    console.log("2")
    product.stock -= quantity;
    if(product.stock< 10){
      
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.USER,
            pass: process.env.PASS
        },
    });

const mailOptions = {
        from: "ayushrai803@gmail.com",
        to: "raiaman172@gmail.com",
        subject: "Out Of Stock",
        html: `
    <p>Dear Retailer,</p>

    <p>We regret to inform you that the product <strong>${product.name}</strong> with ID <strong>${product.id}</strong> is currently out of stock.</p>
    
    <p>Please take the necessary actions to replenish the inventory or update the product status accordingly. We understand that this may cause inconvenience and appreciate your prompt attention to this matter.</p>
    
    <p>If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:support@example.com">support@example.com</a>.</p>
    
    <p>Thank you for your cooperation.</p>
    
    <p>Best regards,<br>
    ShopEasy</p>
  `,
    };

 
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send("Error");
        } else {
            console.log("Email sent:" + info.response);
            

        }})


    }
    await product.save();


    // Save user data
    await user.save();
    
    res.status(200).json({ message: 'Order placed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 // Assuming you have a product model
 router.get('/orders', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await OrderCart.findOne({ emailAddress: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all product details based on productId in orders
    try {
      const detailedOrders = await Promise.all(
        user.orders.map(async (order) => {
          const product = await Products.findOne({ id: order.productId }); // Assuming the productId is stored as _id in the products collection
          if (!product) {
            throw new Error(`Product with ID ${order.productId} not found`);
          }
          return {
            ...order.toObject(),
            productName: product.name,
            productImage: product.image,
            productDescription: product.description,
            productPrice: product.price,
            orderDate: order.date, // Include the order date
          };
        })
      );
    
      // Send the detailed orders along with the date to the client
      res.status(200).json({ orders: detailedOrders });
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Error fetching order details", error: error.message });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/cart', async (req, res) => {
  const { email } = req.query;

  try {
    // Find the user
    const user = await OrderCart.findOne({ emailAddress: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract product IDs from the cart
    const productIds = user.carts.map(item => item.productId);

    // Fetch product details for all product IDs
    const products = await Products.find({ id: { $in: productIds } });

    // Map product details to cart items
    const cartItemsWithDetails = user.carts.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return {
        ...cartItem,
        productName: product ? product.name : 'Unknown',
        productImage: product ? product.image : '',
        productDescription: product ? product.description : '',
        productPrice: product ? product.price : 0,
        dateAdded: cartItem.date, // Include the date when the item was added to the cart
      };
    });

    res.status(200).json({ cartItems: cartItemsWithDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/shopkeeper', async (req, res) => {
  const { name, email, contact,password } = req.body;

  try {
    // Check if a shopkeeper with the given email already exists
    const existingShopkeeper = await Shopkeeper.findOne({ email });
    if (existingShopkeeper) {
      return res.status(400).json({ message: 'Shopkeeper with this email already exists' });
    }

    // Create a new shopkeeper document
    const newShopkeeper = new Shopkeeper({
      name,
      email,
      contact,
      password
    });

    // Save the shopkeeper document
    await newShopkeeper.save();

    res.status(201).json({ message: 'Shopkeeper added successfully', shopkeeper: newShopkeeper });
  } catch (error) {
    res.status(500).json({ message: 'Error adding shopkeeper', error: error.message });
  }
});

router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalProducts = await Products.countDocuments();
    const totalOrders = await OrderCart.aggregate([
      { $unwind: "$orders" }, // Unwind the orders array
      { $count: "totalOrders" } // Count total number of orders
    ]);
    const totalRevenue = await OrderCart.aggregate([
      { $unwind: "$orders" },
      { $group: { _id: null, total: { $sum: "$orders.totalPrice" } } }
    ]);
    const outOfStock = await Products.countDocuments({ stock: { $lte: 10 } });

    res.status(200).json({
      totalProducts,
      totalOrders: totalOrders[0]?.totalOrders || 0,
      totalRevenue: totalRevenue.length ? totalRevenue[0].total : 0,
      outOfStock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Route to get recent orders
router.get('/recent-orders', async (req, res) => {
  try {
    const recentOrders = await OrderCart.aggregate([
      { $unwind: "$orders" }, // Unwind the orders array
      { $sort: { "orders.date": -1 } }, // Sort by most recent date
      { $limit: 5 }, // Limit to 5 most recent orders
      {
        $project: {
          _id: 0, // Don't return the _id field
          emailAddress: 1,
          "orders.productId": 1,
          "orders.quantity": 1,
          "orders.totalPrice": 1,
          "orders.date": 1
        }
      }
    ]);

    res.status(200).json({
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recent orders' });
  }
});

// Route to get products that are low on stock
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Products.find({ stock: { $lte: 10 } }); // Threshold for low stock (e.g., <= 10)
console.log(lowStockProducts);
    res.status(200).json({
      products: lowStockProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching low stock products' });
  }
});

// Route to get sales data for the chart (e.g., monthly sales data)
router.get('/sales-data', async (req, res) => {
  try {
    const salesData = await OrderCart.aggregate([
      { $unwind: "$orders" }, // Unwind the orders array
      {
        $group: {
          _id: { $month: "$orders.date" },  // Group by month
          revenue: { $sum: "$orders.totalPrice" }, // Sum up total revenue
        },
      },
      { $sort: { _id: 1 } } // Sort by month
    ]);

    res.status(200).json({
      sales: salesData.map(item => ({
        month: item._id,
        revenue: item.revenue,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
});

router.get('/productsTable', async (req, res) => {
  try {console.log("H")
    const products = await Products.find(); // Fetch all products from the database
    console.log(products);
    res.json(products);
     // Send the products as JSON response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});


router.get('/ordersTable', async (req, res) => {
  try {
    const orders = await OrderCart.find();
     // Fetch all users and their orders
     
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


router.get('/revenueData', async (req, res) => {
  try {
    const orders = await OrderCart.find(); // Fetch all users and their orders

    // Initialize an object to hold revenue per month
    let revenueData = {};

    // Loop through each user's orders
    orders.forEach((user) => {
      user.orders.forEach((order) => {
        const month = moment(order.date).format('YYYY-MM');

        if (revenueData[month]) {
          revenueData[month] += order.totalPrice;
        } else {
          revenueData[month] = order.totalPrice;
        }
      });
    });

    // Convert the revenueData object into an array for the frontend
    const revenueArray = Object.keys(revenueData).map((month) => ({
      month,
      revenue: revenueData[month],
    }));

    res.status(200).json(revenueArray);
  } catch (err) {
    console.error('Error fetching revenue data:', err);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});
// Backend API
router.get('/outOfStockProducts', async (req, res) => {
  try {
    const outOfStockProducts = await Products.find({ stock: { $lte: 10 } }); // Fetch products with 0 stock

    if (!outOfStockProducts.length) {
      return res.status(200).json({ message: 'No products are out of stock.' });
    }

    res.status(200).json(outOfStockProducts);
  } catch (err) {
    console.error('Error fetching out of stock products:', err);
    res.status(500).json({ error: 'Failed to fetch out of stock products' });
  }
});


router.post('/updateStock', async (req, res) => {
  const { productId, stock } = req.body;

  try {
    // Find the product by its ID
    const stock1 = await Products.findOne({ id: productId });
    
    // If the product is not found, return an error
    if (!stock1) {
      return res.status(400).json({ success: false, message: 'Product not found' });
    }

    const stock2 = stock1.stock;
    console.log(stock2);

    // Update the stock only if the stock is increased
    stock1.stock = stock;

    if (stock1.stock > stock2) {
      // Save the updated stock value
      await stock1.save();

      // Configure nodemailer for sending the email
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        },
      });

      // Email details
      const mailOptions = {
        from: "ayushrai803@gmail.com",
        to: "ayushrai803@gmail.com",
        subject: "Stock Updated Successfully",
        html: `
          <p>Dear Retailer,</p>
          <p>The stock of the product with product ID <strong>${productId}</strong> has been successfully updated to ${stock}.</p>
          <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
          <p>Best regards,<br>ShopEasy</p>
        `,
      };

      // Send the email and await the result
      await transporter.sendMail(mailOptions);

      // Send success response
      return res.status(200).json({ success: true, message: 'Stock updated and email sent.' });
    } else {
      // If the stock is not increased, send a message
      return res.status(400).json({ success: false, message: 'Stock was not increased.' });
    }
  } catch (err) {
    // Handle any errors
    console.error('Error updating stock:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



router.post('/sendMessage', async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    // Create a new message document
    const newMessage = new Message({
      userEmail: email, // Map the 'email' field to 'userEmail' in the schema
      messages: [{ content: message }], // Map 'message' to 'content' in the messages array
      responses: [], // Initialize responses as an empty array
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


router.get('/getMessages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


router.post('/sendResponse', async (req, res) => {
  try {
    const { email, userEmail, messageDate, response } = req.body;
     console.log(email)
     console.log(userEmail)
     console.log(messageDate)
     console.log(response)
    if (!email || !userEmail || !messageDate || !response) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the message document and add the response
    const message = await Message.findOne({
      'messages.date': new Date(messageDate),
      userEmail,
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.responses.push({
      shopkeeperEmail:email,
      response,
      date: new Date(),
    });

    await message.save();

    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
  });

const mailOptions = {
      from: "ayushrai803@gmail.com",
      to: "ayushrai803@gmail.com",
      subject: "Out Of Stock",
      html: `
  <p>Dear User,</p>

  <p>${response} </p>
  
  
  
  <p>Best regards,<br>
  ShopEasy</p>
`,
  };


  await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
          res.send("Error");
      } else {
          console.log("Email sent:" + info.response);
          

      }})




    res.status(200).json({ message: 'Response sent successfully' });
  } catch (err) {
    console.error('Error sending response:', err);
    res.status(500).json({ error: 'Failed to send response' });
  }
});


router.get('/salesData', async (req, res) => {
  try {
    console.log("Fetching sales data...");

    // Aggregating data to calculate total sales per month
    const salesData = await OrderCart.aggregate([
      { $unwind: "$orders" }, // Unwind the orders array
      {
        $match: { "orders.date": { $ne: null } } // Filter out orders where the date is null
      },
      {
        $group: {
          _id: {
            month: { $month: "$orders.date" }, // Group by month
            year: { $year: "$orders.date" }, // Group by year
          },
          totalSales: { $sum: "$orders.totalPrice" }, // Sum up total sales
          totalQuantity: { $sum: "$orders.quantity" }, // Sum up total quantity sold
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
      }
    ]);

    console.log("Sales data fetched successfully:", salesData);

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: 'Error fetching sales data', error });
  }
});


router.get('/topSellingProducts', async (req, res) => {
  try {
    const topSellingProducts = await OrderCart.aggregate([
      { $unwind: "$orders" },
      {
        $group: {
          _id: "$orders.productId",
          totalQuantitySold: { $sum: "$orders.quantity" }, // Sum up the quantity sold
        },
      },
      {
        $lookup: {
          from: "products", // Assuming your products collection is named "products"
          localField: "_id",
          foreignField: "id", // Matching the productId
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$productDetails.name",
          description: "$productDetails.description",
          price: "$productDetails.price",
          stock: "$productDetails.stock",
          totalQuantitySold: 1
        },
      },
      { $sort: { totalQuantitySold: -1 } }, // Sort by the total quantity sold (descending)
      { $limit: 10 } // Get top 10 selling products
    ]);

    res.status(200).json(topSellingProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-selling products', error });
  }
});


router.get('/salesByCategory', async (req, res) => {
  try {
    // Step 1: Fetch all orders from OrderCart
    const allOrders = await OrderCart.find({}, 'orders');

    // Step 2: Create a map to store sales by category
    const categorySalesMap = {};

    // Step 3: Loop through all orders and extract productIds and quantities
    for (let orderCart of allOrders) {
      for (let order of orderCart.orders) {
        const { productId, quantity } = order;

        // Step 4: Fetch the product's category based on the productId
        const product = await Products.findOne({ id: productId });

        if (product) {
          const { category } = product;

          // Step 5: Update the category sales map with quantity
          if (categorySalesMap[category]) {
            categorySalesMap[category] += quantity;
          } else {
            categorySalesMap[category] = quantity;
          }
        }
      }
    }

    // Step 6: Send the category sales data as a response
    res.json({
      message: 'Sales by category',
      categorySales: categorySalesMap
    });

  } catch (error) {
    console.error('Error in fetching sales by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/newCustomersByMonth', async (req, res) => {
  try {
    // Aggregate customers by month
    const customersByMonth = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          count: { $sum: 1 } // Count the number of customers per month
        }
      },
      { $sort: { "_id": 1 } } // Sort by month
    ]);

    // Map the data to return months and customer counts
    const monthlyData = customersByMonth.map(item => ({
      month: item._id,
      customers: item.count
    }));

    res.status(200).json({ data: monthlyData });
  } catch (error) {
    console.error('Error fetching new customers data:', error);
    res.status(500).json({ error: 'Failed to fetch new customers data' });
  }
});


// Route to add a new product
router.post('/addProduct', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'categoryImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id, category, name, description, price, stock } = req.body;

    // Get the image paths
    const productImagePath = req.files.image ? `/Assets/${req.files.image[0].filename}` : null;
    const categoryImagePath = req.files.categoryImage ? `/Assets/${req.files.categoryImage[0].filename}` : null;

    // Create a new product document
    const newProduct = new Products({
      id,
      category,
      categoryImage: categoryImagePath,
      name,
      description,
      price,
      image: productImagePath,
      stock,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product', error });
  }
});




// API to cancel an order and restock the product
router.put('/cancel', async (req, res) => {
  const { email, productId, quantity, totalPrice, date } = req.body;
 console.log(email)
 console.log(productId)
 console.log(quantity)
 console.log(totalPrice)
 console.log(date)

  if (!email || !productId || !quantity || !totalPrice || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the user with the given email and the order with the provided details
    const user = await OrderCart.findOne({
      emailAddress: email,
      'orders.date': new Date(date),
      'orders.productId': productId,
      'orders.totalPrice': totalPrice,
      'orders.quantity': quantity,
    });

    if (!user) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the specific order in the user's orders array
    const order = user.orders.find(order => 
      order.date.toISOString() === new Date(date).toISOString() &&
      order.productId === productId &&
      order.totalPrice === totalPrice &&
      order.quantity === quantity
    );

    if (!order || order.status=='cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled or does not exist' });
    }

    // Update the order's cancelled field to 1
    order.status = 'cancelled';

    // Restock the product based on the order quantity
    const product = await Products.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product's stock by adding back the cancelled quantity
    product.stock += quantity;

    // Save the updated user and product documents
    await user.save();
    await product.save();

    return res.status(200).json({ message: 'Order cancelled and product restocked successfully' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const genAI = new GoogleGenerativeAI(process.env.SECRET_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
router.post('/generate-description', async (req, res) => {
  const { productName, category } = req.body;

  const prompt = `Generate a product description for a product named "${productName}" in the "${category}" category.`;

  try {
      const result = await model.generateContent(prompt);
      const generatedDescription = result.response.text();
      res.json({ description: generatedDescription });
  } catch (error) {
      console.error('Error generating description:', error);
      res.status(500).json({ error: 'Error generating description' });
  }
});
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Perform case-insensitive search
    const products = await Products.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during search' });
  }
});


router.get('/productdetails/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findOne({id}); // Fetch the product by ID from MongoDB
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Get user details by email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      profilePic: user.profilePic || null, // Include profile picture if available
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (username and/or password)
router.put('/user/:email', async (req, res) => {
  const { email } = req.params;
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = password; // 🔒 Consider hashing in real apps

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.put('/user/photo/:email', upload.single('profilePic'), async (req, res) => {
  const { email } = req.params;

  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'profile_pictures' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload failed', error });

        const updatedUser = await User.findOneAndUpdate(
          { email },
          { profilePic: result.secure_url },
          { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json(updatedUser);
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  console.log('Received token:', token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('Google payload:', payload);

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: name,
        profilePic: picture,
        password: 'google_sso_placeholder',
      });
    }

    return res.status(200).json({ email, userType: 'user' });
  } catch (err) {
    console.error('Google SSO error:', err);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
});


module.exports = router;










