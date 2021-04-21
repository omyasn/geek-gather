import * as React from 'react';
import { Request, Response, NextFunction } from 'express';
import preparePage, { IPageParams } from './html/preparePage';


 const serverRenderAndSend = (
        req: Request,
        res: Response,
        next:NextFunction, 
        pageParams: IPageParams,
    ) => {
    const fullHtml = preparePage(pageParams);

    res.send(fullHtml);
    next();
}

export default serverRenderAndSend;
