//import jwt_decode from "jwt-decode";
//import SessionModel from "../models/SessionModel";
//import store from "../Redux/Store";

import { User } from "../context/AppContext";

//import { removeSessionAction } from "../Redux/SessionState";
export const errorAlert = (error:any) => {
    if (error.response){
        console.log(error?.response?.data?.message);
        alert(error?.response?.data?.message);
    }else {
        alert("ERROR !!!");
    }
}

// interface DecodedSession {
//     sub:string;
//     exp:number;
//     iat:number;
// }

export const deepCloneUserState = (newUser:User):User => {
    const updatedUser:User = {userId:null, userName:null, userGame:null, creator: null, games:[]}
    updatedUser.userId = newUser.userId;
    updatedUser.userName = newUser.userName;
    updatedUser.userGame = newUser.userGame;
    updatedUser.creator = newUser.creator;
    updatedUser.games = [...newUser.games];
    return updatedUser;
}
