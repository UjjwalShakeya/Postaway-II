import ApplicationError from "../../utils/ApplicationError.js";

export default function errorHandler(err,req,res,next) {

    // console the error
    console.log("Error: ", err );

    const statusCode = err instanceof ApplicationError ? err.code : 500;
    const message = err instanceof ApplicationError ? err.message : "Internal Server Error";
    
    return res.status(statusCode).json({success: false, error:message});
}