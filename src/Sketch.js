import React, { useEffect, useRef } from 'react';
import P5 from 'p5';
import { io } from 'socket.io-client';
const socket = io('https://p5sketch-ph.herokuapp.com/' 
// {
//     withCredentials: true,
//     transportOptions: {
//         polling: {
//             extraHeaders: {
//                 "custom-header": "aaaa"
//             }
//         }
//     }
// }
);


export const SketchComponent = () => {
    const color = '#FF0000'; 
    const strokeWidth = 4;
    const canvasRef = useRef();

    useEffect(() => {
        const myp5 = new P5(Sketch, canvasRef.current);

        return myp5;
    
    }, []);
  
    const Sketch = (p) => {
        p.setup = () => {
            p.createCanvas(800, 800);
            p.background(255, 255, 255);
            
            socket.on('mouse response', data => {
                p.stroke(data.color);
                p.strokeWeight(data.strokeWidth);
                p.line(data.x, data.y, data.px, data.py);
            });
        };

        p.mouseDragged = () => {
            p.stroke('#FF0000');
            p.strokeWeight(4);
            p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
            sendMouse(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        }; 
        function sendMouse(x, y, pX, pY) {
            const data = {
                x,
                y,
                px: pX,
                py: pY,
                color,
                strokeWidth,
            };

            socket.emit('transmit mouse', data);

        }

    };
    return (
        <div ref={canvasRef}></div>

    );
};