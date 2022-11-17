const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;

const dbConnect = () => {
  mongoose.connect(DB_URI, {
    dbName: DB_NAME,
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