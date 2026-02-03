import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './styles/main.scss';

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [isChasing, setIsChasing] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const armControls = useAnimation();
  const heartRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (!accepted && noBtnRef.current) {
        const rect = noBtnRef.current.getBoundingClientRect();
        const btnCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        
        const dist = Math.sqrt(
          Math.pow(e.clientX - btnCenter.x, 2) + 
          Math.pow(e.clientY - btnCenter.y, 2)
        );

        if (dist < 150) {
          setIsChasing(true);
          // Move away logic
          const angle = Math.atan2(btnCenter.y - e.clientY, btnCenter.x - e.clientX);
          const newX = btnCenter.x + Math.cos(angle) * 200 - rect.width / 2;
          const newY = btnCenter.y + Math.sin(angle) * 200 - rect.height / 2;
          
          // Keep within bounds
          const boundedX = Math.max(50, Math.min(window.innerWidth - 150, newX));
          const boundedY = Math.max(50, Math.min(window.innerHeight - 100, newY));
          
          setNoPos({ x: boundedX, y: boundedY });
        } else {
          setIsChasing(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [accepted]);

  const handleYes = () => {
    setAccepted(true);
    const end = Date.now() + (5 * 1000);
    const colors = ['#FF6B6B', '#FF8E8E', '#FFFFFF'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        shapes: ['circle']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        shapes: ['circle']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Eyes following cursor logic
  const getEyeMovement = (eyeX: number, eyeY: number) => {
    const angle = Math.atan2(mousePos.y - eyeY, mousePos.x - eyeX);
    const dist = Math.min(5, Math.sqrt(Math.pow(mousePos.x - eyeX, 2) + Math.pow(mousePos.y - eyeY, 2)) / 50);
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    };
  };

  return (
    <div className="container">
      {!accepted && <h1 className="title">Krisha, will you be my Valentine?</h1>}
      
      <div className="heart-character" ref={heartRef}>
        <svg viewBox="0 0 200 200">
          {/* Heart Body */}
          <motion.path
            d="M100 160 C100 160 30 120 30 70 C30 40 55 30 70 30 C85 30 100 50 100 50 C100 50 115 30 130 30 C145 30 170 40 170 70 C170 120 100 160 100 160 Z"
            fill="#FF6B6B"
            animate={accepted ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          
          {/* Eyes */}
          <g transform="translate(75, 70)">
            <circle cx="0" cy="0" r="6" fill="white" />
            <motion.circle 
              cx={getEyeMovement(window.innerWidth/2 - 25, window.innerHeight/2 - 30).x} 
              cy={getEyeMovement(window.innerWidth/2 - 25, window.innerHeight/2 - 30).y} 
              r="3" 
              fill="black" 
            />
            {accepted && <motion.path d="M-3,-3 L3,3 M-3,3 L3,-3" stroke="yellow" strokeWidth="1" animate={{rotate: 360}} transition={{repeat: Infinity}}/>}
          </g>
          <g transform="translate(125, 70)">
            <circle cx="0" cy="0" r="6" fill="white" />
            <motion.circle 
              cx={getEyeMovement(window.innerWidth/2 + 25, window.innerHeight/2 - 30).x} 
              cy={getEyeMovement(window.innerWidth/2 + 25, window.innerHeight/2 - 30).y} 
              r="3" 
              fill="black" 
            />
            {accepted && <motion.path d="M-3,-3 L3,3 M-3,3 L3,-3" stroke="yellow" strokeWidth="1" animate={{rotate: 360}} transition={{repeat: Infinity}}/>}
          </g>

          {/* Arms */}
          <motion.path
            d={accepted ? "M60 100 Q40 60 20 40" : isChasing ? "M60 100 Q30 80 10 110" : "M60 100 Q80 120 100 120"}
            stroke="#4A4A4A"
            strokeWidth="4"
            fill="none"
            animate={isChasing ? { y: [0, -10, 0], x: [0, 5, 0] } : accepted ? { y: [0, -20, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
          />
          <motion.path
            d={accepted ? "M140 100 Q160 60 180 40" : isChasing ? "M140 100 Q170 80 190 110" : "M140 100 Q120 120 100 120"}
            stroke="#4A4A4A"
            strokeWidth="4"
            fill="none"
            animate={isChasing ? { y: [0, -10, 0], x: [0, -5, 0] } : accepted ? { y: [0, -20, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
          />

          {/* Smile */}
          <path
            d={accepted ? "M85 100 Q100 120 115 100" : "M90 100 Q100 110 110 100"}
            stroke="#4A4A4A"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {!accepted && (
        <div className="button-container">
          <button className="btn-yes" onClick={handleYes}>YES!</button>
          <button 
            ref={noBtnRef}
            className="btn-no" 
            style={{ 
              left: noPos.x !== 0 ? `${noPos.x}px` : 'auto', 
              top: noPos.y !== 0 ? `${noPos.y}px` : 'auto',
              marginLeft: noPos.x === 0 ? '150px' : '0'
            }}
          >
            No
          </button>
        </div>
      )}

      {accepted && (
        <motion.div 
          className="success-message"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2>Yuppeee!! ❤️</h2>
          <p>I knew you'd say yes!</p>
        </motion.div>
      )}
    </div>
  );
};

export default App;
