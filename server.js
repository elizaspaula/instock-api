require('dotenv').config(); //load .env variables
const express = require('express'); 
const app = express();
const cors = require('cors');
const inventoryRoutes = require("./routes/inventoryRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const PORT = process.env.PORT;


//
// Middleware
//
app.use((req, res, next) => {
  console.log(new Date(Date.now()).toLocaleString(), req.originalUrl);
  next();
})
app.use(express.json()); // add req.body
app.use(cors()); // allow cross-origin resource sharing
app.use(express.static('public')); // adds public folder for serving images



//
// Routing
//
app.use("/warehouses", warehouseRoutes);
app.use("/inventory", inventoryRoutes);



//
// Listening
//
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})