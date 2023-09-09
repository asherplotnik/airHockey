import { createContext, useContext } from "react";

export interface User {
    userId: string;
    userName: string;
    userGame: string;
    games: string[];
}

interface UserUpdater {
    user:User;
    setUser: Function;
}
export const AppContext = createContext<UserUpdater | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("user is null");
    }

    return context;
}