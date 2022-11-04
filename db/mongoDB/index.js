const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const photoSchema = new mongoose.Schema(
  {
    url: { type: String },
  },
);

const characteristicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    characteristic_id: { type: Number, required: true },
    value: { type: Number, required: true },
  },
);

const ratingSchema = new mongoose.Schema(
  {
    star_0: { type: Number, default: 0 },
    star_1: { type: Number, default: 0 },
    star_2: { type: Number, default: 0 },
    star_3: { type: Number, default: 0 },
    star_4: { type: Number, default: 0 },
    star_5: { type: Number, default: 0 },
  },
);

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number },
    summary: { type: String },
    recommend: { type: Boolean },
    response: { type: String },
    body: { type: String },
    date: { type: Date },
    reviewer_name: { type: String },
    helpfulness: { type: Number },
    photos: [
      photoSchema,
    ],
  },
);

const reviewMetaSchema = new mongoose.Schema(
  {
    product_id: { type: Number },
    ratings: [
      ratingSchema,
    ],
    characteristics: [
      characteristicSchema,
    ],
    recommended: {
      true: Number,
      false: Number,
    },
  },
);

const Review = mongoose.model('Review', reviewSchema);
const ReviewMeta = mongoose.model('ReviewMeta', reviewMetaSchema);

module.exports = { Review, ReviewMeta };
