import { Request, Response, NextFunction } from 'express';

import * as ErrorSystem from '../classes/errors.class';

export default (err: any, req: Request, res: Response, next: NextFunction) => {

    // log the error
    console.log(`======================================ERROR======================================\n\n
        %O\n\n
        ===================================END OF ERROR==================================`, err
    );
    
    if (err instanceof ErrorSystem.DomainError) {

        // responds to the error
        return res.status(err.statusCode).json({
            status: 'error',
            name: err.name,
            message: err.message
        });
    }

    // this if statement controls how much info we send
    // In development, send everything to be helpful
    // In production, be more secretive
    if (process.env.USE_PROD == 'false') {

        // send a detailed response
        res.status(500).json({
            error: err,
            message: err.message,
            stack: err.stack
        });

    } else {

        // send a minimal response
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred'
        });
    }
};