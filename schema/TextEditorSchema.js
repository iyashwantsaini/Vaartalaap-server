const { Schema, model } = require("mongoose");

const TextEditorSchema = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("TextEditorSchema", TextEditorSchema);
