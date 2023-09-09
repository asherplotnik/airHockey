import { useState } from "react";
import classes from "./JoinGame.module.css";
import { useUserContext } from "../../../context/AppContext";
import { deepCloneUserState } from "../../../Services/commonFunctionService";
import { useNavigate } from "react-router-dom";
const JoinGame = () => {
  const userContext = useUserContext();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleClick = (game: string) => {
    setSelectedGame(game);
    const updatedUser = deepCloneUserState(userContext.user);
    updatedUser.userGame = game;
    userContext.setUser(updatedUser);
    navigate("/game");
  };
  return (
    <div className={classes.JoinGame}>
      <div className={classes.GameList}>
        <h2>Choose a Game </h2>
        <ul>
          {userContext.user.games.map((game, index) => (
            <li
              key={index}
              onClick={() => handleClick(game)}
              className={ selectedGame === game ? classes.Selected : classes.GameItem}
            >
              {game}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JoinGame;
