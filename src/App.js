import React, {useState} from 'react';
import Scene from './scene';
import { io } from 'socket.io-client';
import LandingPage from './LandingPage';

// import { SketchComponent } from './Sketch';
  // const socket = io('http://localhost:8000')
export const socket = io.connect('http://localhost:8000');

export const SocketContext = React.createContext();

function App() {
  
  const [landing, setLanding] = useState(true);
  const [room, setRoom] = useState('');

  if(landing) return (
    <SocketContext.Provider value = {socket}>
      <LandingPage setLanding={setLanding} setRoom={setRoom} room={room}/>
    </SocketContext.Provider>
  );

  return (
    <SocketContext.Provider value={socket}>
      <Scene room={room} setLanding={setLanding}/>
    </SocketContext.Provider>
  );
}

export default App;
