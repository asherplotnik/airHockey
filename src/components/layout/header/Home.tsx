import { useEffect } from "react";
import classes from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/AppContext";
const Home = () => {
  const navigate = useNavigate();
  const context = useUserContext();

  useEffect(() => {
    if (context.user.userId === null) {
        navigate("/login");
    }
  },[]);
  
  return (
    <div className={classes.Home}>
      <div className={classes.HomeItem} onClick={() => navigate("/create")}> 
        CREATE GAME
      </div>
      <div className={classes.HomeItem} onClick={() => navigate("/join")}>
        JOIN GAME
      </div>
    </div>
  );
};

export default Home;
