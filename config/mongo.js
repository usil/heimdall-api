const mongoose = require("mongoose");

const dbConnect = () => {
  // const DB_URI = process.env.DB_URI;
  mongoose.connect("mongodb://mongo", {
    dbName: 'heimdall-api',
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
    (err, res) => {
      if (!err) {
        console.log(' *** CONNECT WITH MONGO *** ')
      } else {
        console.log(' *** ERROR CONNECT WITH MONGO *** ')
      }
    }
  )
}

module.exports = dbConnect