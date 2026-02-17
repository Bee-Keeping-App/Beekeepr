import { Request, Response, NextFunction, RequestHandler } from 'express';

export default (controller: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // If the async function throws an error, .catch(next) 
        // automatically sends it to your error middleware
        Promise.resolve(controller(req, res, next)).catch(next);
    };
};