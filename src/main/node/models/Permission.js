const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const PermissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true
    },
    resource: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
)

PermissionSchema.plugin(mongooseDelete, {
  overrideMethods: 'all'
})

module.exports = mongoose.model("permission", PermissionSchema)