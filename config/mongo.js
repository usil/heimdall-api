const mongoose = require("mongoose"); console.log

const dbConnect = () => {
  const DB_URI = process.env.DB_URI;
  mongoose.connect(DB_URI, {
    dbName: 'statusWeb',
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