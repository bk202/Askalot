import {ApiController} from "./ApiController";
import {AxiosPromise} from "axios";
import {APIUrls} from "../../../server/urls";
import {FrontEndAuthModels} from "../models/AuthModels";
import LoginRequest = FrontEndAuthModels.LoginRequest;
import RegistrationRequest = FrontEndAuthModels.RegistrationRequest;


export class CommonController extends ApiController{

    public static _instance : CommonController = new CommonController();

    public static getInstance():CommonController {
        return CommonController._instance;
    }

    private constructor() {
        if(CommonController._instance){
            throw new Error("Error: Instantiation failed: Use AuthService.getInstance() instead of new.");
        }
        super();
        CommonController._instance = this;
    }

    login (login: LoginRequest) : AxiosPromise {
        return this.post(APIUrls.Login, login);
    }

    logout () : void {
        this.removeToken();
    }

    registerUser (regRequest : RegistrationRequest) : AxiosPromise {
        return this.post(APIUrls.Register, regRequest);
    }

    checkEmailAvailability(email: string){
        return this.get(APIUrls.EmailAvailability.replace(":email", email));
    }

    checkUserNameAvailability(username: string){
        return this.get(APIUrls.UsernameAvailability.replace(":username", username));
    }

    getCountries () : AxiosPromise {
        return this.get(APIUrls.getCountries);
    }

    getUniversities (countryId : string) : AxiosPromise {
        return this.get(APIUrls.getUniversitiesByCountry.replace(":country", countryId));
    }
}
