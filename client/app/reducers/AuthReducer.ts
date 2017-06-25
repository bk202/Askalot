import {AuthActionTypes} from "../constants/AuthActionTypes";
import {ReducerStateStatus} from "../constants/ReducerStateStatus";
import {CommonController} from "../api.controllers/CommonController";
import * as JwtDecode from 'jwt-decode';
export interface AuthReducerState {
    status: ReducerStateStatus;
    user: any;
    loggedIn: boolean;
}

const getLoginStatusAndUser = (): any => {
    let token = CommonController.getInstance().getToken();
    if (token){
        return {
            loggedIn: true,
            user: JwtDecode(token)
        }
    }
    return {
        loggedIn: false,
        user: undefined
    }
}

const initialState: AuthReducerState = {
    status: ReducerStateStatus.LOADING,
    ...getLoginStatusAndUser()
};

export const AuthReducer = (state = initialState, action): AuthReducerState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_REQUEST:
            return initialState;
        case AuthActionTypes.LOGIN_OK:
            return {
                status: ReducerStateStatus.DONE,
                ...getLoginStatusAndUser()
            };
        case AuthActionTypes.LOGIN_ERR:
            return {
                status: ReducerStateStatus.ERROR,
                ...getLoginStatusAndUser()
            };
        case AuthActionTypes.LOGOUT:
            return {
                status: ReducerStateStatus.NONE,
                user: null,
                loggedIn: false
            };
        default:
            return state;
    }
};