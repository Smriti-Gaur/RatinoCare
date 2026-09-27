const errorHandler = (
    err,
    req,
    res,
    next
)=>{

    console.error(err);

    const statusCode =
        err.statusCode || 500;

    res.status(statusCode).json({

        success:false,

        message: err.statusCode || process.env.NODE_ENV === "development"
            ? err.message
            : "An unexpected server error occurred",

    });

};

export default errorHandler;