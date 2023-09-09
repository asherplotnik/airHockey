import { useEffect, useState } from "react";
import classes from "./CreateGame.module.css";
import io, { Socket } from 'socket.io-client';

interface Telemetry {
    game: number;
    xPlayer: number;
    yPlayer: number;
    height:  number;
    xDisk: number;
    yDisk: number;
}

const WebSocketTest = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [telemtry, setTelemetry] = useState<Telemetry | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/ws'); 
    socket.on('message', payload => {
      setMessage(payload.message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('telemetry', payload => {
      setTelemetry(payload.telemetry);
    });

    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = (sendMessage: string) => {
    if (socket) {
        socket.emit('join_game', sendMessage);
    }
  };
  
    return (
        <>
            <div className={classes.CreateGame} onClick={()=> joinGame("1")}>
                Join game 1 {message}
            </div>
            <div className={classes.CreateGame} onClick={()=> joinGame("2")}>
                Join game 2 {message}
            </div>
        </>
    );
}

export default WebSocketTest;