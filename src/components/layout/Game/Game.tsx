import { Fragment, useEffect, useState } from "react";
import classes from "./Game.module.css";

interface ScreenPosition {
  x: number;
  y: number;
}

const Game = () => {
  const [mousePosition, setMousePosition] = useState<ScreenPosition>({ x: 0, y: 0 });
  const [divPosition, setDivPosition] = useState<ScreenPosition>({ x: 0, y: 0 });
  const [screenSize, setScreenSize] = useState<ScreenPosition>({ x: window.innerWidth, y: window.innerHeight });
  const [diskPosition, setDiskPosition] = useState<ScreenPosition>({ x: window.innerWidth / 2, y: window.innerHeight / 1.3, });
  const [diskSpeed, setDiskSpeed] = useState<ScreenPosition>({ x:0, y:0 });
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleResize = () => {
    setScreenSize({ x: window.innerWidth, y: window.innerHeight });
  };

  useEffect(() => {
    const updatePositions = () => {
      setDivPosition({
        x: updateMouseNewX(),
        y: updateMouseNewY(),
      });
      setDiskPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 1.3,
      });
    };

    updatePositions();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePosition]);

  const updateMouseNewX = (): number => {
    const maxX = screenSize.x / 2 + (screenSize.y * 0.3);
    const minX = screenSize.x / 2 - (screenSize.y * 0.3);
    if (mousePosition.x > minX && mousePosition.x < maxX) {
      return mousePosition.x - screenSize.y / 40;
    }

    if (mousePosition.x > maxX) {
      return maxX - screenSize.y / 40;
    }
    if (mousePosition.x < minX) {
      return minX - screenSize.y / 40;
    }
    return diskPosition.x;
  };

  const updateMouseNewY = (): number => {
    const minY = screenSize.y / 2 + screenSize.y / 30;
    const maxY = screenSize.y - screenSize.y / 30;
    if (mousePosition.y > minY && mousePosition.y < maxY) {
      return mousePosition.y - screenSize.y / 40;
    }
    if (mousePosition.y > maxY) {
      return maxY - screenSize.y / 40;
    }
    if (mousePosition.y < minY) {
      return minY - screenSize.y / 40;
    }
    return diskPosition.y;
  };

  const listenImpactDisk = () => {
    if (false) {

    }

  }

  listenImpactDisk();
  const adjuster1 = 79;
  return (
    <div className={classes.Game}>
        <div className={classes.PositionPlayer}>player1: ( {Math.round(divPosition.x,1)} | {Math.round(divPosition.y,1)} )</div>
        <div className={classes.PositionDisk}>
            disk: ( {Math.round(diskPosition.x,1)} | {Math.round(diskPosition.y,1)} )
            <br />
            <br />
            screen size y : {screenSize.y}
        </div>
      <div className={classes.Goal1}></div>
      <div className={classes.Goal2}></div>
      <div className={classes.Table}>
        <div
          className={classes.Disk}
          style={{ left: diskPosition.x, top: diskPosition.y }}
        ></div>
        <div className={classes.Area1}>
          <div className={classes.Player1}></div>
        </div>
        <div className={classes.Area2}>
          <div
            className={classes.Player2}
            style={{ left: divPosition.x, top: divPosition.y }}
          ></div>
          <div
            className={classes.Player2Mid}
            style={{ left: divPosition.x + screenSize.y / adjuster1, top: divPosition.y + screenSize.y / adjuster1}}
          ></div>
          <div
            className={classes.Player2Center}
            style={{ left: divPosition.x + screenSize.y / 41, top: divPosition.y + screenSize.y / 41}}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Game;
