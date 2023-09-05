import { useEffect, useMemo, useState } from "react";
import classes from "./CreateGame.module.css";
import { io } from "socket.io-client";
const CreateGame = () => {
    const [receivedMessage, setReceivedMessage] = useState('');
    const socket = useMemo(()=> io('http://127.0.0.1:8080'),[]);
    useEffect(() => {
        socket.on('message', (message: string) => {
          setReceivedMessage(message);
          console.log(message);
        });

        socket.emit('message', "message");
        
      }, []); 
    
    return (
        <div className={classes.CreateGame}>
            Create Game {receivedMessage}
        </div>
    );
}

export default CreateGame