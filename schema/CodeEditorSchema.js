const { Schema, model } = require("mongoose");

const CodeEditorSchema = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("CodeEditorSchema", CodeEditorSchema);
