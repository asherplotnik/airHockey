import { createContext, useContext } from "react";

export interface User {
    userId: string;
    userName: string;
    userGame: string;
    creator: boolean;
    games: string[];
}

interface UserUpdater {
    user:User;
    setUser: (user: User) => void;
}
export const AppContext = createContext<UserUpdater | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("user is null");
    }

    return context;
}