import { useContext, useState } from "react";
import classes from "./CreateGame.module.css";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { deepCloneUserState } from "../../../Services/commonFunctionService";

const CreateGame = () => {
  const context = useContext(AppContext);
  const [name, setName] = useState<string>("");
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const game = context.user.games.find((gameName) => gameName === name);
    if (game !== undefined) {
      setIsNameValid(false);
      return;
    } 
    setIsNameValid(true);
    const updatedUser = deepCloneUserState(context.user);
    updatedUser.games.push(name);
    updatedUser.userGame = name;
    context.setUser(updatedUser);
    navigate("/game");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
  };
  return (
    <div className={classes.CreateGame}>
      <form onSubmit={handleSubmit} className={classes.MyForm}>
        <div>
          <label htmlFor="name" className={classes.MyLabel}>
            Choose Game Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            className={classes.MyInput}
          />
        </div>
        {isNameValid === false && (
          <div className={classes.ErrorMessage}>
            Name already exists. Please choose a different name.
          </div>
        )}
        <div>
          <button type="submit" className={classes.MyButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGame;
