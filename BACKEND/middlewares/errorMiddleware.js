class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    // console.error("Error Middleware Triggered:", err.message); // Debug log
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;


    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} value entered`;
        err = new ErrorHandler(message, 400);
    }


    if (err.name === "JsonWebTokenError") {
        const message = "Your token is invalid, please log in again";
        err = new ErrorHandler(message, 400);

    }
    if (err.name === "CastError") {
        const message = `Resource not found, ${err.path}`;
        err = new ErrorHandler(message, 400);



    }

    const errorMessage = err.errors 
    ? Object.values(err.errors)
    .map(error => error.message)
    .join(" ") 
    : err.Message;


    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });


};


export default ErrorHandler;
