class ApiError {
    constructor(status, message) {
        this.message = message;
        this.status = status;
        console.log(message)
    }
}

module.exports = ApiError;