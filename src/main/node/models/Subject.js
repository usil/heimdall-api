const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const SubjectSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      unique: true
    },
    secret: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    longLiveTokenUuid: {
      type: String
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

SubjectSchema.plugin(mongooseDelete, {
  overrideMethods: 'all'
})

module.exports = mongoose.model("subject", SubjectSchema)