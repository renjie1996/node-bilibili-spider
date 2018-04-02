const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  bilibiliId: String,
  content: Array,
  articleContentHtml: String,
  createdAt: {
    type: Number,
    default: Date.now().valueOf()
  },
  originCreateAt: Number,
  title: String,
  tags: [
    {
      name: String,
      value: String,
      score: Number
    }
  ]
})

const articleModel = mongoose.model('article', ArticleSchema);

module.exports = {
  model: articleModel
}