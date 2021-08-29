const { Schema, model } = require("mongoose");

const TextEditorData = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("TextEditorData", TextEditorData);
