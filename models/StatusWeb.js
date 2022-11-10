const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const StatusWebSchema = new mongoose.Schema(
  {
    webBaseUrl: String,
    expectResponseCode: Number,
    resultTest: {
      timeString: String,
      dateString: String,
      responseTimeMillis: Number,
      responseCode: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

StatusWebSchema.plugin(mongooseDelete, {
  overrideMethods: 'all'
})

module.exports = mongoose.model("StatusWebs", StatusWebSchema)