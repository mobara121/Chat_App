import React, {useState, useEffect} from "react";
import io from 'socket.io-client';
import './App.css';

let socket;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('')
  const [name, setName] = useState('');

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const CONNECTION_PORT = 'localhost:3002/';

  useEffect(()=>{
    socket = io(CONNECTION_PORT) //initializing connection

  }, [CONNECTION_PORT])

  useEffect(()=> {
    socket.on("receive_message", (data)=>{
      // debugger;
      console.log(data);
      setMessageList([...messageList, data])
    });
  });

  //important!! this sends the data'room' to socket
  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit('join_room', room)
  }

  const sendMessage = async(e) => {
    console.log(message)
    // debugger;
    let messageContent = {
      room: room,
      content: {
        author: name,
        message: message
      },
    };
    await socket.emit("send_message", messageContent)
    setMessageList([...messageList, messageContent.content])
    setMessage("");
    // e.preventDefault();
  };

  return (
    <div className="App">
      Chat demo
      {!loggedIn ? (
        <div className="logIn">
          <p>Please log in</p>
          <form>
            <input type="text" placeholder="Name" value={name} onChange={(e)=>{setName(e.target.value)}}></input>
            <input type="text" placeholder="Room" onChange={(e)=>setRoom(e.target.value)}></input>
            <div style={{margin: '0 auto'}}>
            <button onClick={connectToRoom}>Enter chat</button></div>
          </form>
        </div>
        ) : (
          <div className="chatContainer">
            <div className="messages">
              {messageList.map((val, key)=> {
                // debugger;
                return (
                  <div
                  className="messageContainer"
                  id={val.author === name ? "You" : "Other"}
                >{val.author}
                  <div className="messageIndividual">
                    {val.message}
                  </div>
                </div>
                );
              })}
            </div>
            <div className="messageInputs">

                <input type="text" placeholder="message" value={message} onChange={(event)=>setMessage(event.target.value)}></input>
                <button type="submit" onClick={sendMessage}>Send</button>

            </div>
          </div>
        )}
    </div>
  );
}

export default App;
