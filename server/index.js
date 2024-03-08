const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Initialize express()
const app = express();

// MiddleWare
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ credentials: true, origin: "https://jacceyblog.netlify.app/" }));
app.use(cors({ credentials: true, origin: "https://jacceyblog.netlify.app" }));
app.use(upload());
// folder path where images will be saved
app.use("/uploads", express.static(__dirname + "/uploads"));

// Route Mounting
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// CONNECT to MongoDB/Mongoose Database and start SERVER
const DB = process.env.MONGO_DB.replace(
  "<password>",
  process.env.MONGO_DB_PASSWORD
);
const port = process.env.PORT || 5000;

connect(DB)
  .then(
    // START SERVER
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )
  .catch((error) => {
    console.log(error);
  });
