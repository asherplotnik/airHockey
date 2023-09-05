import jwt_decode from "jwt-decode";
import SessionModel from "../models/SessionModel";
import store from "../Redux/Store";
import { removeSessionAction } from "../Redux/SessionState";
export const errorAlert = (error:any) => {
    if (error.response){
        console.log(error?.response?.data?.message);
        alert(error?.response?.data?.message);
    }else {
        alert("ERROR !!!");
    }
}

interface DecodedSession {
    sub:string;
    exp:number;
    iat:number;
}

export const isSessionNotExpired = (session:SessionModel):boolean => {
    if (session?.token) {
        const token = session.token;
        const decodedSession: DecodedSession = jwt_decode(token);
        if (decodedSession){
           if (Math.floor(Math.floor(Date.now() / 1000)) < decodedSession.exp){
             return true;
         }
        }
    }   
    return false;
}

export const isStoreSessionNotExpired = ():boolean => {
    const session = store.getState().SessionState.session;
    if (session?.token) {
        const token = session.token;
        const decodedSession: DecodedSession = jwt_decode(token);
        if (decodedSession){
           if (Math.floor(Math.floor(Date.now() / 1000)) < decodedSession.exp){
             return true;
         }
        }
    }   
    return false;
}

export const resetSessionIfExpired = () => {
   const session = store.getState().SessionState.session;
    if (session.token){
        if (!isSessionNotExpired(session)) {
            store.dispatch(removeSessionAction());
        }
    }
}
