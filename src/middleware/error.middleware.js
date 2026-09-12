import { NODE_ENV } from "../config.js"

export const globalErrorHandling = (error, req, res, next) => {
    return res.status(error.cause?.status ?? 500).json({
        error_message: error.message || "something went wrong",
        error: NODE_ENV == 'development' ? error : undefined,
        stack: NODE_ENV == 'development' ? error.stack : undefined
    })

}

