import { useEffect, useState } from "react";
import classes from "./JoinGame.module.css";
import { useUserContext } from "../../../context/AppContext";
import { deepCloneUserState } from "../../../Services/commonFunctionService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import globals from "../../../Services/Globals";
import Game from "../../../models/Game";
const JoinGame = () => {
  const userContext = useUserContext();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [games, setGames] = useState<string[] | null>(userContext.user.games);
  const navigate = useNavigate();

  useEffect(() => {
    const getGames = () => {
      axios.get<Game[]>(globals.urls.apiRest + "/games")
      .then((res) => {
        if (res.data.length > 0) {
          const updatedUser = deepCloneUserState(userContext.user);
          const openGames = res.data.filter(game => !game.joiner).map(game => game.name);
          updatedUser.games = openGames;
          userContext.setUser(updatedUser);
          setGames(openGames);
        } else {
          alert("no open games yet!");
        }
      });
    };
    getGames();
  }, []);

  const handleClick = (game: string) => {
    setSelectedGame(game);
    axios.get(globals.urls.apiRest + `/join?name=${game}&joiner=${userContext.user.userId}`)
    .then((res) => {
        if (res.data && res.data.message === `joined game: ${game}`) {
            const updatedUser = deepCloneUserState(userContext.user);
            updatedUser.userGame = game;
            userContext.setUser(updatedUser);
        }
    })
    const updatedUser = deepCloneUserState(userContext.user);
    updatedUser.userGame = game;
    updatedUser.creator = false;
    userContext.setUser(updatedUser);
    navigate("/game");
  };
  return (
    <div className={classes.JoinGame}>
      <div className={classes.GameList}>
        <h2>Choose a Game </h2>
        <ul>
          {games.map((game, index) => (
            <li
              key={index}
              onClick={() => handleClick(game)}
              className={
                selectedGame === game ? classes.Selected : classes.GameItem
              }
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
