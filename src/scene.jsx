import React, { useRef, useEffect, useContext } from "react";
import { SocketContext } from './App';
import Matter from "matter-js";
// import * as Tone from 'tone';
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:8000')

const Scene = ({room, setLanding}) => {
  // const [scene, setScene] = useState();

  const socket = useContext(SocketContext);
  
  socket.currentRoom = room;
  // console.log(socket)
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  // const [response, setResponse] = useState('');
  
  let Engine = Matter.Engine;
  let Render = Matter.Render;
  // let World = Matter.World;
  let Bodies = Matter.Bodies;
  let Mouse = Matter.Mouse;
  let MouseConstraint = Matter.MouseConstraint;
  let Composite = Matter.Composite;
  useEffect(() => {
    console.log('room from useEffect', room)
    engineRef.current = Engine.create({});
    engineRef.current.gravity.y = 1;

    let render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: 600,
        height: 600,
        wireframes: false
      }
    });

    let ballA = Bodies.circle(210, 100, 50, { 
      restitution: 0.5,
    });
    // let ballB = Bodies.circle(110, 50, 10, { restitution: 0.5 });
    Composite.add(engineRef.current.world, [
      // walls
      Bodies.rectangle(200, 0, 600, 50, { isStatic: true }),
      Bodies.rectangle(200, 600, 600, 50, { isStatic: true }),
      Bodies.rectangle(500, 250, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    Composite.add(engineRef.current.world, [ballA]);

        // add mouse control
        let mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engineRef.current, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false
            }
          }
        });
  
      
        Composite.add(engineRef.current.world, mouseConstraint);
        Matter.Events.on(mouseConstraint, "mouseup", function(event) {
          // console.log('outgoing-down', event.mouse.mousedownPosition);
          socket.emit('ball dropped', socket.currentRoom, {x: event.mouse.mouseupPosition.x, y: event.mouse.mouseupPosition.y})
  
        });

//       Matter.Events.on(mouseConstraint, "mouseup", function(event) {
//         console.log('mouseup event', event);
//         // console.log('outgoing-down', event.mouse.mousedownPosition);
//         socket.emit('ball dropped', room, {x: event.mouse.mouseupPosition.x, y: event.mouse.mouseupPosition.y})

//       });
      

//       Matter.Events.on(mouseConstraint, "startdrag", function(event) {
//         // console.log(event)
//         // console.log('outgoing-down', event.mouse.mousedownPosition)
//         socket.emit('ball move', {x: event.body.position.x, y: event.body.position.y})
//       });
//       Matter.Events.on(mouseConstraint, "enddrag", function(event) {

//         // console.log(event)
//         // console.log('outgoing-down', event.mouse.mousedownPosition)
//         socket.emit('ball move', {x: event.body.position.x, y: event.body.position.y})

//       });

      
      Matter.Runner.run(engineRef.current);
  
      Render.run(render);

      socket.on('emit drop', data => {

        console.log(data)
        Composite.add(engineRef.current.world, Bodies.circle(data.x, data.y, 30, { restitution: 0.7 }));
      })
      socket.on('ball move', data => {
          // const circle = engineRef.current.world.bodies[3];
          // circle.position.x = data.x;
          // circle.position.y = data.y;
          // circle.frictionAir = 1;
          // console.log(data.x, data.y)
        
      
      }) 
      // console.log(engineRef.current)
  }, []);
    
    

  const handleDisconnect =()=>{
    socket.emit('leave')
    setLanding(true)
  }
  // const handleClick = async () => {
  //   console.log('clicked');
  //   // const synth = new Tone.Synth().toDestination();
  //   await Tone.start();
  //   const synth = new Tone.Synth().toDestination();
  //   const synth2 = new Tone.Synth().toDestination();

  //     Matter.Events.on(engineRef.current, 'collisionStart', function(event) {
  //       if(event){
  //         console.log('event', event)
  //         let a = event.source.pairs.list[0].bodyA.label
  //         let b = event.source.pairs.list[0].bodyB.label
  //         if(a === "Circle Body" && b === "Circle Body"){

  //           synth.triggerAttackRelease('C4', '8n')
  //            console.log('a', a)
  //         }
  //         // if(b === "Circle Body"){
  //         //   synth2.triggerAttackRelease('F4', '4n');
  //         //   console.log('b', b)
  //         // }

  //       } 
  //       // let b = event.pairs[1] ? event.pairs[1] : null;
  //       // let b = event.pairs[1] ? event.pairs[1] : null
      
  //       // check bodies, do whatever...
  //     });
    
  // }

  const handleRoomStart = ()=> {
    socket.emit('start', {id: socket.id})
  }
  
  return( 
    <>
      <button onClick={handleDisconnect}>leave</button> 
      <button onClick={handleRoomStart}>start</button>  
      <div ref={sceneRef} />
      </>
  );

}

export default Scene;
