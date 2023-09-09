import { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { User, useUserContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const context = useUserContext();
  
  useEffect(()=>{
    if (logged) {
        navigate("/");
      }
  },[logged]);
  
 
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {userId: userId, userName: userName, userGame: null, games:context.user.games};
    context.setUser(newUser);
    setLogged(true);
  };
  

  return (
      <div className={classes.Login}>
        <form className={classes.LoginForm} onSubmit={handleFormSubmit}>
          <div className={classes.FormGroup}>
            <label htmlFor="userId" className={classes.Label}>
              User ID:
            </label>
            <input
              type="text"
              id="userId"
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
