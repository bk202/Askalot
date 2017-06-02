
import { NextFunction, Request, Response, Router } from "express";
import {APIUrls} from '../../common/urls';
import * as path from 'path';



export class HomeAPI {

    constructor(router: Router) {
        router.get(APIUrls.HomeData, this.homeData);
    }

    public homeData = (req: Request, res: Response, next: NextFunction) =>{
        res.json({'message' : 'Hello world'})
    }
}