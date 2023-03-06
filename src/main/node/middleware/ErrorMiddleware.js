const include = require('nodejs-require-enhancer');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');

@PostMiddleware
function ErrorMiddleware() {

    this.dispatch = (error, req, res, next) => {
        console.log("Error Handling at middleware @PostMiddleware")
        console.log('Path: ', req.path)
        console.error('Error: ', error)

        if (error.code && error.message) {
            return res.status(parseInt(error.code/1000)).send({
                code: error.code,
                message: error.message
            });
        } else {
            return res.status(500).send({
                code: ApiResponseCodes.internal_error.code,
                message: ApiResponseCodes.internal_error.reason
            });
        }
    }
}

module.exports = ErrorMiddleware;