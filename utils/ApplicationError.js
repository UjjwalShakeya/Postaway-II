export default class ApplicationError extends Error{
    constructor (message,code){
        super(message);
        this.name = this.constructor.name;
        this.code = code;

        if (Error.captureStackTrace){
            Error.captureStackTrace(this, this.constructor); // Create a clean stack trace for  error
        };
    }
}