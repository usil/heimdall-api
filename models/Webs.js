const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const WebSchema = new mongoose.Schema(
  {
    webBaseUrl: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      unique: true
    },
    description: String,
    expectResponseCode: Number
  },
  {
    timestamps: true,
    versionKey: false
  }
)

WebSchema.plugin(mongooseDelete, {
  overrideMethods: 'all'
})

/* WebSchema.statics.findAllData = function () {
  const joinData = this.aggregate([
    {
      $lookup: {
        from: "pings",
        let: {
          alias: "$webBaseUrl"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$webBaseUrl", "$$alias"]
              }
            }
          }
        ],
        as: "results"
      }
    },
    {
      $unwind: "$results"
    }
  ])

  return joinData
}; */

module.exports = mongoose.model("webs", WebSchema)