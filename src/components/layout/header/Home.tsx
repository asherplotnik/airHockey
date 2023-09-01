import classes from "./Home.module.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.Home}>
      {/* <div className={classes.HomeItem} onClick={() => navigate("/create")}> */}
      <div className={classes.HomeItem} onClick={() => navigate("/game")}> 
        CREATE GAME
      </div>
      <div className={classes.HomeItem} onClick={() => navigate("/join")}>
        JOIN GAME
      </div>
    </div>
  );
};

export default Home;
