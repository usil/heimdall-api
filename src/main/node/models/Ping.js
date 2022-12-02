const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const PingSchema = new mongoose.Schema(
  {
    webBaseUrl: String,
    timeString: String,
    dateString: String,
    responseTimeMillis: Number,
    responseCode: String
  },
  {
    timestamps: false,
    versionKey: false
  }
)

PingSchema.plugin(mongooseDelete, {
  overrideMethods: 'all'
})

module.exports = mongoose.model("pings", PingSchema)