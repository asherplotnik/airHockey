import { useEffect, useState } from "react";
import classes from "./Game.module.css";
import { useUserContext } from "../../../context/AppContext";
import { Socket, io } from "socket.io-client";
import globals from "../../../Services/Globals";
import { useNavigate } from "react-router-dom";
import { deepCloneUserState } from "../../../Services/commonFunctionService";

interface ScreenPosition {
  x: number;
  y: number;
}


interface Telemetry {
    game: string;
    id: string
    xPlayer: number;
    yPlayer: number;
    height:  number;
    width: number
    xDisk: number;
    yDisk: number;
    diskSpeed: ScreenPosition;
}

const Game = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const context = useUserContext();
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const userContext = useUserContext().user;
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState<ScreenPosition>({
    x: 0,
    y: 0,
  });
  const [playerPosition, setPlayerPosition] = useState<ScreenPosition>({
    x: 0,
    y: 0,
  });
  const [playerPosition2, setPlayerPosition2] = useState<ScreenPosition>({
    x: 0,
    y: 0,
  });
  const [screenSize, setScreenSize] = useState<ScreenPosition>({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const [diskPosition, setDiskPosition] = useState<ScreenPosition>({
    x: window.innerWidth / 2 - window.innerHeight / 51,
    y: userContext.creator ? window.innerHeight / 1.2 : window.innerHeight - (window.innerHeight / 1.2) - (window.innerHeight/51)*2,
  });
  
  const [diskSpeed, setDiskSpeed] = useState<ScreenPosition>({ x: 0, y: 0 });
  let playerCenter = {
    x: playerPosition.x + screenSize.y / 41,
    y: playerPosition.y + screenSize.y / 41,
  } as ScreenPosition;

  let diskCenter = {
    x: diskPosition.x + screenSize.y / 51,
    y: diskPosition.y + screenSize.y / 51,
  } as ScreenPosition;
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const newSocket = io(globals.urls.apiWs); 
    
    newSocket.on('telemetry', payload => {
        const translatePosition = (payload:any):ScreenPosition => {
            const height = payload.telemetry?.height;
            const ratioX = height / screenSize.y;
            let xp = payload.telemetry?.xPlayer;
            let yp = payload.telemetry?.yPlayer;
            if (xp >= 0 && yp >= 0) {
                yp = screenSize.y - (yp / height * screenSize.y) - (screenSize.y / 16);
                xp = (screenSize.x/2 + screenSize.y*0.323) - xp/ratioX -screenSize.y/20.5
                return {x:xp,y:yp};
            }
         }
         setPlayerPosition2(translatePosition(payload));
    });

    newSocket.on('impact', payload => {
        const translatePlayerPosition = (payload:any):ScreenPosition => {
            const height = payload.telemetry?.height;
            const ratioX = height / screenSize.y;
            let xp = payload.telemetry?.xPlayer;
            let yp = payload.telemetry?.yPlayer;
            if (xp >= 0 && yp >= 0) {
                yp = screenSize.y - (yp / ratioX) - (screenSize.y / 16);
                xp = (screenSize.x/2 + screenSize.y*0.323) - xp/ratioX - screenSize.y/20.5
                return {x:xp,y:yp};
            }
         }

         const translateDiskPosition = (payload:any):ScreenPosition => {
            const height = payload.telemetry?.height;
            const ratioX = height / screenSize.y;
            let xd = payload.telemetry?.xDisk;
            let yd = payload.telemetry?.yDisk;
            if (xd >= 0 && yd >= 0) {
                yd = screenSize.y - (yd / ratioX) - (screenSize.y / 16);
                xd = (screenSize.x/2 + screenSize.y*0.323) - xd/ratioX - screenSize.y/25.5
                return {x:xd,y:yd};
            }
         }

         setPlayerPosition2(translatePlayerPosition(payload));
         setDiskPosition(translateDiskPosition(payload));
         setDiskSpeed({x :payload.telemetry.diskSpeed.x*-1 , y: payload.telemetry.diskSpeed.y*-1 })
    });

    newSocket.on("game_over", () => {
        closeGame();
    })

    setSocket(newSocket);
    return () => {
        newSocket.disconnect();
    };
  }, []);

  useEffect(()=> {
    const joinGame = (game: string) => {
        if (socket) {
            socket.emit('join_game', game);
        }
    };

    if (context.user.userGame !== null){
        joinGame(context.user.userGame);
    }
  },[socket])

  const sendTelemetry = () => {
    let playerX = playerPosition?.x  - (screenSize.x / 2 - screenSize.y * 0.3 - screenSize.y / 40);
    let playerY = playerPosition?.y;
    let diskX = diskPosition?.x - (screenSize.x / 2 - screenSize.y * 0.3- screenSize.y / 50)
    let diskY = diskPosition?.y;
    if (!playerX){ 
        playerX=0;
    };
    if (!playerY){ 
        playerY=0;
    };
    const telemetry: Telemetry = {
        game: context.user.userGame,
        id: context.user.userId,
        height: window.innerHeight,
        width: window.innerWidth,
        xPlayer: playerX,
        yPlayer: playerY,
        xDisk: diskX,
        yDisk: diskY,
        diskSpeed: {x: diskSpeed.x , y: diskSpeed.y }
    }
    if(socket) {
        socket.emit("telemetry", telemetry)
    }
  }
  const sendImpact = (dSpeed:ScreenPosition) => {
    let playerX = playerPosition?.x  - (screenSize.x / 2 - screenSize.y * 0.3 - screenSize.y / 40);
    let playerY = playerPosition?.y;
    let diskX = diskPosition?.x - (screenSize.x / 2 - screenSize.y * 0.3- screenSize.y / 50)
    let diskY = diskPosition?.y;
    if (!playerX){ 
        playerX=0;
    };
    if (!playerY){ 
        playerY=0;
    };
    const telemetry: Telemetry = {
        game: context.user.userGame,
        id: context.user.userId,
        height: window.innerHeight,
        width: window.innerWidth,
        xPlayer: playerX,
        yPlayer: playerY,
        xDisk: diskX,
        yDisk: diskY,
        diskSpeed: dSpeed
    }
    if(socket) {
        socket.emit("impact", telemetry)
    }
  }

  useEffect(() => {
    const setNewDiskPositionBySpeed = () => {
      const maxX = screenSize.x / 2 + screenSize.y * 0.285;
      const minX = screenSize.x / 2 - screenSize.y * 0.325;
      const maxY = screenSize.y - screenSize.y / 22;
      const minY = screenSize.y / 150;
      const speedAdjuster = 0.02;
      const x = (diskPosition.x - diskSpeed.x * speedAdjuster);
      const y = (diskPosition.y - diskSpeed.y * speedAdjuster);
      let result = { x: diskPosition.x, y: diskPosition.y };
      if (diskPosition.x > minX && diskPosition.x < maxX) {
        result.x = x;
      } else {
        result.x = diskPosition.x + diskSpeed.x * speedAdjuster;
        setDiskSpeed({ x: diskSpeed.x * -1, y: diskSpeed.y });
      }
      if (diskPosition.y > minY && diskPosition.y < maxY) {
        result.y = y;
      } else {
        if (isGoal()) {
          resetGame();
          return;
        }
        result.y = diskPosition.y + diskSpeed.y * speedAdjuster;
        setDiskSpeed({ x: diskSpeed.x, y: diskSpeed.y * -1 });
      }
      if (diskSpeed.x != 0 && diskSpeed.y != 0) {
        setDiskPosition(result);
      }
    };

    const resetGame = () => {
      if (diskPosition.y > window.innerHeight / 1.2) {
        setScoreP2((prev) => prev + 1);
        setDiskPosition({
            x: window.innerWidth / 2 - window.innerHeight / 51,
            y: window.innerHeight / 1.2 
          });
      } else {
        setScoreP1((prev) => prev + 1);
        setDiskPosition({
            x: window.innerWidth / 2 - window.innerHeight / 51,
            y: window.innerHeight - (window.innerHeight / 1.2) - (window.innerHeight/51)*2
            
          });
      }
      
      setPlayerPosition({
        x: window.innerWidth / 2 - window.innerWidth / 10,
        y: window.innerHeight / 1.2,
      });
      setDiskSpeed({ x: 0, y: 0 });
      if (scoreP1 > 6 || scoreP2 > 6 ){
        socket.emit("game_over", userContext.userGame );
        closeGame();
      }
    };

    const isGoal = (): boolean => {
      const x1 = window.innerWidth / 2 - window.innerWidth / 14;
      const x2 = window.innerWidth / 2 + window.innerWidth / 19;
      if (diskCenter.x >= x1 && diskCenter.x <= x2) {
        return true;
      }
      return false;
    };

    const intervalId = setInterval(() => {
        setNewDiskPositionBySpeed();
    }, 2)

    return () => {
        clearInterval(intervalId);
      };
    
  }, [diskPosition, diskSpeed]);

  useEffect(() => {
    const updatePositions = () => {
      setPlayerPosition(updateMouseNewPlayerPosition());
    };

    const handleResize = () => {
      setScreenSize({ x: window.innerWidth, y: window.innerHeight });
    };

    updatePositions();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    sendTelemetry();
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePosition, screenSize]);

  const updateMouseNewPlayerPosition = (): ScreenPosition => {
    const maxX = screenSize.x / 2 + screenSize.y * 0.3;
    const minX = screenSize.x / 2 - screenSize.y * 0.3;
    const minY = screenSize.y / 2 + screenSize.y / 30;
    const maxY = screenSize.y - screenSize.y / 30;
    let result = { x: 0, y: 0 };
    if (mousePosition.x > minX && mousePosition.x < maxX) {
      result.x = mousePosition.x - screenSize.y / 40;
    }
    if (mousePosition.x > maxX) {
      result.x = maxX - screenSize.y / 40;
    }
    if (mousePosition.x < minX) {
      result.x = minX - screenSize.y / 40;
    }
    if (mousePosition.y > minY && mousePosition.y < maxY) {
      result.y = mousePosition.y - screenSize.y / 40;
    }
    if (mousePosition.y > maxY) {
      result.y = maxY - screenSize.y / 40;
    }
    if (mousePosition.y < minY) {
      result.y = minY - screenSize.y / 40;
    }
    return result;
  };

  useEffect(() => {
    const listenImpactDisk = () => {
      if (
        screenSize.y / 41 + screenSize.y / 51 >
        Math.sqrt(
          Math.pow(playerCenter.x - diskCenter.x, 2) +
            Math.pow(playerCenter.y - diskCenter.y, 2)
        )
      ) {
        const newPosition = calcNewDiskPosition(diskPosition, playerCenter);
        if (
          newPosition.x != diskPosition.x ||
          newPosition.y != diskPosition.y
        ) {
          setDiskPosition(newPosition);
          setDiskSpeed(calcNewSpeed(playerCenter));
        }
        if (
          newPosition.x == diskPosition.x &&
          newPosition.y == diskPosition.y
        ) {
          resetPlayer();
        }
        sendImpact(calcNewSpeed(playerCenter));
      }

    };

    const calcNewSpeed = (pCenter: ScreenPosition): ScreenPosition => {
      const x = pCenter.x - diskCenter.x;
      const y = pCenter.y - diskCenter.y;
      return { x, y };
    };

    const calcNewDiskPosition = (prev: ScreenPosition, pCenter: ScreenPosition): ScreenPosition => {
      const maxX = screenSize.x / 2 + screenSize.y * 0.285;
      const minX = screenSize.x / 2 - screenSize.y * 0.325;
      const maxY = screenSize.y - screenSize.y / 22;
      const minY = screenSize.y / 30;
      const x = prev.x - (pCenter.x - diskCenter.x) / 40;
      const y = prev.y - (pCenter.y - diskCenter.y) / 40;
      let result = { x: prev.x, y: prev.y };
      if (prev.x > minX && prev.x < maxX) {
        result.x = x;
      }
      if (prev.y > minY && prev.y < maxY) {
        result.y = y;
      }
      return result;
    };

    const resetPlayer = () => {
      const x = playerCenter.x - diskCenter.x;
      const y = playerCenter.y - diskCenter.y;
      const resetPosition = { x: playerPosition.x, y: playerPosition.y };
      if (x < 0) {
        resetPosition.x = playerPosition.x - 1;
      }
      if (x > 0) {
        resetPosition.x = playerPosition.x + 1;
      }
      if (y < 0) {
        resetPosition.y = playerPosition.y - 1;
      }
      if (y > 0) {
        resetPosition.y = playerPosition.y + 1;
      }
      setPlayerPosition(resetPosition);
    };
    listenImpactDisk();
  }, [diskPosition, playerPosition, playerPosition2, screenSize]);

  const closeGame = () => {
    const updateC = deepCloneUserState(userContext);
    updateC.games = updateC.games.filter(game => game !== userContext.userGame)
    updateC.userGame = null;
    context.setUser(updateC);
    navigate("/")
  }

  return (
    <div className={classes.Game}>
      <div className={classes.PositionPlayer}>
        player1: ( {Math.round(playerCenter.x)} |{" "}
        {Math.round(playerCenter.y)} )
      </div>
      <div className={classes.PositionDisk}>
        disk: ( {Math.round(diskCenter.x)} | {Math.round(diskCenter.y)} )
        <br />
        disk speed: ({diskSpeed.x} | {diskSpeed.y})
        <br />
        <div className={classes.PositionDisk}>Game: {userContext.userGame}</div>
        <br />
        screen height: {window.innerHeight}
        <br />
        screen width: {window.innerWidth}
        <br />
        <br />
        Me : {scoreP1}
        <br />
        Opponent : {scoreP2}
      </div>
      <div className={classes.PositionDisk}></div>
      <div className={classes.Goal1}></div>
      <div className={classes.Goal2}></div>
      <div className={classes.Table}>
        <div
          className={classes.Disk}
          style={{ left: diskPosition.x, top: diskPosition.y }}
        ></div>
        <div className={classes.Area1}>
          <div 
            className={classes.Player2}
            style={{ left: playerPosition2?.x, top: playerPosition2?.y }}
          ></div>
        </div>
        <div className={classes.Area2}>
          <div
            className={classes.Player1}
            style={{ left: playerPosition.x, top: playerPosition.y }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Game;