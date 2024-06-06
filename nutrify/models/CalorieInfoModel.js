const mongoose = require('mongoose');

const CalorieInfoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  totalCalories: { type: Number, required: true },
  caloriesConsumed: { type: Number, required: true },
  caloriesToGo: { type: Number, required: true },
});

const CalorieInfoModel = mongoose.model('CalorieInfo', CalorieInfoSchema);

module.exports = CalorieInfoModel;