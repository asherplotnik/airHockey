import { useState, useEffect, useRef } from "react";
import classes from "./Login.module.css";
import { User, useUserContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import globals from "../../../Services/Globals";
import axios from "axios";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const context = useUserContext();
  const formRef = useRef();
  useEffect(()=>{
    if (logged) {
        navigate("/");
      }
  },[logged]);
  
 
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current as HTMLFormElement);
    const userName = formData.get("userName") as string;
    const userId = formData.get("userId") as string;
    const userGame:string = null;
    const form = {userName, userId , userGame} as User;

    requestLogin(form);
  };

  const requestLogin = (form:User) => {
    const apiUrl = globals.urls.apiRest+"/login"; 
    axios.post<User>(apiUrl,{userId: form.userId, userName: form.userName, userGame: form.userGame})
      .then((res) => {
        if(!res.data){
            console.log("empty response");
        }
        console.log(res);
        const newUser: User = {userId: res.data.userId, userName: res.data.userName, userGame: null, games:context.user.games};
        context.setUser(newUser);
        setLogged(true);        
      })
      .catch((error) => {
        console.log(error);
        alert(`something went wrong: ${error}`)
      });
  };
  

  return (
      <div className={classes.Login}>
        <form className={classes.LoginForm} onSubmit={handleFormSubmit} ref={formRef}>
          <div className={classes.FormGroup}>
            <label htmlFor="userId" className={classes.Label}>
              User ID:
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              className={classes.Input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className={classes.FormGroup}>
            <label htmlFor="userName" className={classes.Label}>
              User Name:
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              className={classes.Input}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className={classes.FormGroup}>
            <button type="submit" className={classes.SubmitButton}>
              Log In
            </button>
          </div>
        </form>
      </div>
  );
};

export default Login;
