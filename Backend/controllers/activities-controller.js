const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Activity = require("../models/activity");
const User = require("../models/user");

/********************************/
// Get activity by Activity ID
/********************************/
const getActivityById = async (req, res, next) => {
  const activityId = req.params.aid;
  let activity;
  try {
    activity = await Activity.findById(activityId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a activity",
      500
    );
    return next(error);
  }

  if (!activity) {
    const error = new HttpError(
      "Could not find a activity for the provided id",
      404
    );
    return next(error);
  }

  res.json({ activity: activity.toObject({ getters: true }) });
};

/*************************************/
// Get Activities by User ID Activity
/************************************/
const getActivitiesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let activities;
  let userWithActivities;
  try {
    userWithActivities = await User.findById(userId).populate("activities");
  } catch (err) {
    const error = new HttpError(
      "Fetching activities failed, please try again later",
      500
    );
    return next(error);
  }

  if (!userWithActivities || userWithActivities.activities.length === 0) {
    return next(
      new HttpError("Could not find activities for the provided user id", 404)
    );
  }

  res.json({
    activities: userWithActivities.activities.map((activity) =>
      activity.toObject({ getters: true })
    ),
  });
};

/***************************/
//      Create Activity
/***************************/
const createActivity = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid input passed, please check your data.", 422);
  }

  const { title, description, time, date, creater } = req.body;
  const createdActivity = new Activity({
    title,
    description,
    image:
      "https://media.istockphoto.com/id/533446895/photo/muscular-man-skipping-rope.jpg?b=1&s=170667a&w=0&k=20&c=WA0bAgwPK72-gZ-PfUkfJEw4IRcAcPjyfO-0VLTaopk=",
    time,
    date,
    creater,
  });

  let user;

  try {
    user = await User.findById(creater);
  } catch (err) {
    const error = new HttpError(
      "Creating activity failed, please try again later",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdActivity.save({ session: sess });
    user.activities.push(createdActivity);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating activity failed, Please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ activity: createdActivity });
};

/***************************/
//    Update Activity
/***************************/
const updateActivity = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data.", 422)
    );
  }

  const _id = req.params.id;
  let activity;
  try {
    activity = await Activity.findByIdAndUpdate(_id, req.body, { new: true });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update activity",
      500
    );
    return next(error);
  }
  res.status(200).json({ activiy: activity.toObject({ getters: true }) });
};

/***************************/
//    Delete Activity
/***************************/

const deleteActivity = async (req, res, next) => {
  const activityId = req.params._id;

  let activity;
  try {
    activity = await Activity.findById(activityId).populate("creater");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete activity.",
      500
    );
    return next(error);
  }

  if (!activity) {
    const error = new HttpError("Could not find activity for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await activity.remove({ session: sess });
    activity.creater.activities.pull(activity);
    await activity.creater.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not delete activity.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted activity." });
};

exports.getActivityById = getActivityById;
exports.getActivitiesByUserId = getActivitiesByUserId;
exports.createActivity = createActivity;
exports.updateActivity = updateActivity;
exports.deleteActivity = deleteActivity;
