const { Schema, model } = require("mongoose");

const CodeEditorData = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("CodeEditorData", CodeEditorData);
