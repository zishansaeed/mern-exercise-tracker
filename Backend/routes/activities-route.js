const express = require("express");
const { check } = require("express-validator");

const activityControllers = require("../controllers/activities-controller");

const router = express.Router();

// Get activity by Activity ID
router.get("/:aid", activityControllers.getActivityById);

// Get activity by User ID
router.get("/user/:uid", activityControllers.getActivitiesByUserId);

// Create Acitivity
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("time").not().isEmpty(),
    check("date").not().isEmpty(),
  ],
  activityControllers.createActivity
);

// Update Acitivity
router.patch(
  "/:id",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  activityControllers.updateActivity
);

// Delete Acitivity
router.delete("/:_id", activityControllers.deleteActivity);

module.exports = router;
