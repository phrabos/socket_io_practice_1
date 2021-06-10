import React from 'react';
import Scene from './scene';
import { io } from 'socket.io-client';

// import { SketchComponent } from './Sketch';
  // const socket = io('http://localhost:8000')
export const socket = io.connect('http://localhost:8000');
export const SocketContext = React.createContext();
function App() {
  return (
    // <SketchComponent />
    <SocketContext.Provider value={socket}>
    <Scene />
    </SocketContext.Provider>
  );
}

export default App;
