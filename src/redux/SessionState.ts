
// Handling Products AppState

import { isSessionNotExpired } from "../Services/commonFunctionService";
import SessionModel from "../models/SessionModel";

// Products AppState - המידע ברמת האפליקציה הקשור למוצרים - אלו בעצם כל המוצרים:
export class SessionState {
    public session: SessionModel = {id:"",token:"",name:"", email:"", userScore:0} ; // We're going to create initial object
    public constructor() {
        const storedSession = JSON.parse(localStorage.getItem("session") || "{}");
        if(storedSession) {
            if(isSessionNotExpired(storedSession)){
                this.session = storedSession;
            } 
        }
    }
}


// ----------------------------------------------------------------------------------

// Products Action Types - אלו פעולות ניתן לבצע על המידע ברמת האפליקציה:
export enum SessionActionType {
    SetSession="SetSession",
    RemoveSession="RemoveSession", 
}

// ----------------------------------------------------------------------------------

// Product Action - אובייקט המכיל את המידע עבור הפעולה שאנו מבצעים על המידע ברמת הפליקציה
export interface SessionAction {
    type: SessionActionType;
    payload?: any; // payload?: any; if the payload can be empty.
}

// ----------------------------------------------------------------------------------

// Products Action Creators - מתאים עבור כל פעולה Action ומחזירות אובייקט payload-פונקציות המקבלות את ה

export  const setSessionAction = (session: SessionModel): SessionAction => {
    return { type: SessionActionType.SetSession, payload: session };
}

export  const removeSessionAction = (): SessionAction => {
    return { type: SessionActionType.RemoveSession};
}

// ----------------------------------------------------------------------------------

// Products Reducer - פונקציה המבצעת את הפעולה בפועל
export const SessionReducer = (currentState: SessionState = new SessionState(), action: SessionAction): SessionState => {
    
    const newState = {...currentState}; // Spread Operator - שכפול אובייקט

    switch(action.type) {
        case SessionActionType.SetSession:
            newState.session.id = action.payload.id;     
            newState.session.name = action.payload.name;     
            newState.session.email = action.payload.email;   
            newState.session.token = action.payload.token;
            newState.session.userScore = action.payload.userScore; 
            localStorage.setItem("session", JSON.stringify(newState.session));
            break;
        case SessionActionType.RemoveSession:
            newState.session = {id:"",token:"",name:"", email:"", userScore:0};
            localStorage.removeItem("session"); // clear user from the local storage.
            break;
    }

    return newState;
}
