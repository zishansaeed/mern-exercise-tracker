const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const activitiesRoutes = require("./routes/activities-route");
const usersRoutes = require("./routes/user-route");
const HttpError = require("./models/http-error");

const port = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/activity", activitiesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://zeeshan:test1234@cluster0.27ssrtn.mongodb.net/exercise_tracker?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
