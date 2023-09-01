import { Fragment, useEffect, useState } from "react";
import classes from "./Game.module.css";

interface ScreenPosition {
  x: number;
  y: number;
}

const Game = () => {
  const [mousePosition, setMousePosition] = useState<ScreenPosition>({ x: 0, y: 0 });
  const [divPosition, setDivPosition] = useState<ScreenPosition>({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState<ScreenPosition>({ x: window.innerWidth, y: window.innerHeight});
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleResize = () => {
    setScreenSize({ x: window.innerWidth, y: window.innerHeight})
  }

  useEffect(() => {
    const updateDivPosition = () => {
      setDivPosition({ 
            x: updateNewX(),
            y: updateNewY() 
        });
    };

    updateDivPosition();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePosition]);

const updateNewX = ():number => {
    const maxX = screenSize.x/2 + screenSize.y*0.6/2;
    const minX = screenSize.x/2 - screenSize.y*0.6/2;
    if (mousePosition.x > minX && mousePosition.x < maxX){
        return mousePosition.x - screenSize.y/40;
    }

    if (mousePosition.x > maxX) {
        return maxX - screenSize.y/40;
    }
    if (mousePosition.x < minX) {
        return minX - screenSize.y/40;
    }
    
    return divPosition.x;
}

const updateNewY = ():number => {
    const minY = screenSize.y / 2 + screenSize.y/26;
    const maxY = screenSize.y - screenSize.y/26;
    if (mousePosition.y > minY && mousePosition.y < maxY){
        return mousePosition.y - screenSize.y/40;
    }
    if (mousePosition.y > maxY) {
        return maxY - screenSize.y/40;
    }
    if (mousePosition.y < minY) {
        return minY - screenSize.y/40;
    }

    return divPosition.y;
}



  return (
    <div className={classes.Game}>
      <div className={classes.Goal1}></div>
      <div className={classes.Goal2}></div>
      <div className={classes.Table}>
        <div className={classes.Disk}></div>
        <div className={classes.Area1}>
          <div className={classes.Player1}></div>
        </div>
        <div className={classes.Area2}>
          <div
            className={classes.Player2}
            style={{ left: divPosition.x, top: divPosition.y }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Game;


