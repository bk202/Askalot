import {NextFunction, Request, Response, Router} from "express";
import {BaseAPI} from "./BaseAPI";
import {APIUrls} from "../urls";
import {ILocationService} from "../services/LocationService";
import {IUserService} from "../services/UserService";
import {AuthRequest, mustBeAuthenticated} from "../middlewares/AuthMiddleware";

export class UserAPI extends BaseAPI {

    private service : IUserService;
    public router: Router;
    constructor(service: IUserService) {
        super();
        this.router = Router();
        this.service = service;
        this.router.put(APIUrls.updateProfile, mustBeAuthenticated, this.updateProfile);

    }

    public updateProfile = (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.body;
        const currentUser = req.user;
        const promise = this.service.updateUser(user, currentUser);
        this.respondPromise(promise, res, next);
    };

}
