const ErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        err: err.message,
        stack: err.stack,
    });
};
export default ErrorHandler;
