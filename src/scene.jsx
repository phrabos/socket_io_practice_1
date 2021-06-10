import React, { useRef, useEffect, useContext } from "react";
import { SocketContext } from './App';
import Matter from "matter-js";
// import * as Tone from 'tone';
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:8000')

const Scene = () => {
  // const [scene, setScene] = useState();
  const socket = useContext(SocketContext);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  // const [response, setResponse] = useState('');

  let Engine = Matter.Engine;
  let Render = Matter.Render;
  let World = Matter.World;
  let Bodies = Matter.Bodies;
  let Mouse = Matter.Mouse;
  let MouseConstraint = Matter.MouseConstraint;


  useEffect(() => {

    engineRef.current = Engine.create({});
    engineRef.current.gravity.y = 1.3;

    let render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: 800,
        height: 800,
        wireframes: false
      }
    });

    let ballA = Bodies.circle(210, 100, 10, { restitution: 0.5 });
    // let ballB = Bodies.circle(110, 50, 10, { restitution: 0.5 });
    World.add(engineRef.current.world, [
      // walls
      Bodies.rectangle(200, 0, 600, 50, { isStatic: true }),
      Bodies.rectangle(200, 600, 600, 50, { isStatic: true }),
      // Bodies.rectangle(260, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    World.add(engineRef.current.world, [ballA]);

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
  
      World.add(engineRef.current.world, mouseConstraint);
  
      Matter.Events.on(mouseConstraint, "mouseup", function(event) {
        // console.log(event);
        // console.log('outgoing-down', event.mouse.mousedownPosition);
        socket.emit('ball dropped', { x:event.mouse.mouseupPosition.x, y:event.mouse.mouseupPosition.y})

      });
      Matter.Events.on(mouseConstraint, "enddrag", function(event) {
        // console.log(event);
        // console.log('outgoing-down', event.mouse.mousedownPosition);
        socket.emit('ball move', { id: 1, x:210, y:100})
      });
      
      Matter.Runner.run(engineRef.current);
  
      Render.run(render);

      socket.on('emit drop', data => {
        // console.log('incoming', data)
        // World.add(engineRef.current.world, Bodies.circle(50, 50, 30, { restitution: 0.7 }));
        // World.add(engineRef.current.world, Bodies.circle(data.x, data.y, 30, { restitution: 0.7 }));
      })
      socket.on('moved ball', data => {
        // console.log('incoming', data)
        // World.add(engineRef.current.world, Bodies.circle(50, 50, 30, { restitution: 0.7 }));
        const circle = engineRef.current.world.bodies[3];
        circle.position.x = data.x;
        circle.position.y = data.y;

        
        
        // World.add(engineRef.current.world, Bodies.circle(data.x, data.y, 30, { restitution: 0.7 }));
      })
      // console.log(engineRef.current)
    }, []);
    
    


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

  return( 
    <>
      {/* <button onClick={handleClick}>start synth</button> */}
      <div ref={sceneRef} />
      </>
  );

}

export default Scene;
