import React, { useContext, useState } from 'react'
import { SocketContext } from './App';

export default function LandingPage({setLanding, setRoom, room}) {
    
    const socket = useContext(SocketContext);
    const [rooms, setRooms] = useState(100);
    const [roomObject, setRoomObject] = useState(null);

    socket.on('current state', data=>{
        setRoomObject(data)
    });
    

    const handleJoinRoom = (e) =>{
        e.preventDefault()
        socket.emit('join room', room)
        setLanding(false)
    };

    const handleCollab = ()=> {
        socket.emit('collab', room)
    }
  
    return (
        <div>
            <button onClick={handleCollab}>collab</button>
            <form onSubmit={handleJoinRoom}>
                <input type="text" value={room} onChange={({target})=>setRoom(target.value)}/>
                <button>join</button>
            </form>
            
        </div>
    )
}
