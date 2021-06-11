import React, { useContext } from 'react'
import { SocketContext } from './App';

export default function LandingPage({setLanding, setRoom, room}) {
    
    const socket = useContext(SocketContext);

    const handleJoinRoom = (e) =>{
        e.preventDefault()
        socket.emit('join room', room)
        setLanding(false)
    };
  
    return (
        <div>
            <form onSubmit={handleJoinRoom}>
                <input type="text" value={room} onChange={({target})=>setRoom(target.value)}/>
                <button>join</button>
            </form>
            
        </div>
    )
}
