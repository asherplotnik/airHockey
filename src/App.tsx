import classes from "./App.module.css";
import { Route, Routes } from "react-router-dom";
import CreateGame from "./components/layout/createGame/CreateGame";
import JoinGame from "./components/layout/joinGame/JoinGame";
import Game from "./components/layout/Game/Game";
import Home from "./components/layout/header/Home";
import { useState } from "react";
import { AppContext, User } from "./context/AppContext";
import Login from "./components/layout/login/Login";
const App = () => {
  const [user, setUser] = useState<User>({
    userId: null,
    userName: null,
    userGame: null,
    creator: null,
    games: [],
  });

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <div className={classes.App}>
        <Routes>
          <Route path="/game" Component={Game} />
          <Route path="/create" Component={CreateGame} />
          <Route path="/join" Component={JoinGame} />
          <Route path="/login" Component={Login} />
          <Route path="/" Component={Home} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
};

export default App;
