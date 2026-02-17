import { Request, Response, NextFunction } from 'express';

/* Again another example of a single-logic function.
    That's why its export default and anonymized.

    The logger is called when the request hits, and 
    logs once it resolves (with the .on("finish") signal). 
*/

export default (req: Request, res: Response, next: NextFunction) => {
    const start: number = Date.now();   // gets the time a request is received

    res.on("finish", () => {
        const duration: number = Date.now() - start;    // gets the elapsed time
        console.log(
            `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
        );
    });

    next(); // triggers next call
};