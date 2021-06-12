import React, { useContext, useState } from 'react'
import { SocketContext } from './App';

export default function LandingPage({setLanding, setRoom, room}) {
    
    const socket = useContext(SocketContext);
    
    const handleCollab = ()=> {
        socket.emit('collab', {id: socket.id})
        setLanding(false)
    }
 
    socket.on('set room', data=>{
        setRoom(data)
    }) 
    
    console.log(room)

  
    return (
        <div>
            <button onClick={handleCollab}>collab</button>   
        </div>
    )
}
