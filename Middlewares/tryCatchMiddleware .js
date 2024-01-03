const tryCatchMiddleware = (trycatchHandler) => {
    return async (req, res, next) => {
        try {
            await trycatchHandler(req, res, next);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: "Failure",
                message: "error",
                error_message: error.message,
            });
        }
    };
};

module.exports = tryCatchMiddleware;
