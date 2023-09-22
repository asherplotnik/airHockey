import { useState, useRef } from "react";
import classes from "./CreateGame.module.css";
import { useNavigate } from "react-router-dom";
import { deepCloneUserState } from "../../../Services/commonFunctionService";
import { User, useUserContext } from "../../../context/AppContext";
import axios from "axios";
import globals from "../../../Services/Globals";

const CreateGame = () => {
  const context = useUserContext();
  const [name, setName] = useState<string>("");
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const formRef = useRef();
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current as HTMLFormElement);
    const gameName = formData.get("name") as string;
    const apiUrl = globals.urls.apiRest+"/create"; 
    axios.post<string>(apiUrl,{creator: context.user.userId, name: gameName, created: Date.now})
    .then((res) => {
      if(!res.data){
          console.log("empty response");
      }
      console.log(res.data);
      updateContextUser(gameName);    
      setIsNameValid(true);  
      navigate("/game"); 
    })
    .catch((error) => {
      console.log(error);
      setIsNameValid(false);
      alert(`something went wrong: ${error}`);
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
  };

  const updateContextUser = (name: string) => {
    const contextUser = deepCloneUserState(context.user);
      contextUser.userGame = name;
      const games = [...contextUser.games];
      games.push(name);
      contextUser.games = games;
      context.setUser(contextUser);
  }

  return (
    <div className={classes.CreateGame}>
      <form onSubmit={handleSubmit} className={classes.MyForm} ref={formRef}>
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
