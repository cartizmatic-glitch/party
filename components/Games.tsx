
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/audio';
import { generateTriviaQuestions, TriviaQuestion } from '../services/gemini';
import { Loader2, X, Circle, Hand, Scissors, Square, Bomb, Gift, MapPin, Trophy, Flag, Goal, Crosshair, Users, Crown } from 'lucide-react';

interface GameProps {
  onGameOver: (score: number) => void;
}

// --- Multiplayer: 1. Wild Duel (2 Player) ---
export const DuelGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'ended'>('waiting');
    const [winner, setWinner] = useState<number | null>(null);
    const [scoreP1, setScoreP1] = useState(0);
    const [scoreP2, setScoreP2] = useState(0);

    const startRound = () => {
        setGameState('waiting');
        setWinner(null);
        setTimeout(() => {
            setGameState('ready');
            setTimeout(() => {
                setGameState('go');
                sfx.playTone(600, 'square', 0.2);
            }, 1000 + Math.random() * 3000);
        }, 1000);
    };

    useEffect(() => {
        startRound();
    }, []);

    const handleTap = (player: number) => {
        if (gameState === 'ended') return;

        if (gameState === 'go') {
            setWinner(player);
            setGameState('ended');
            sfx.playSuccess();
            if (player === 1) setScoreP1(s => s + 1);
            else setScoreP2(s => s + 1);
            setTimeout(startRound, 2000);
        } else if (gameState === 'ready' || gameState === 'waiting') {
            // False start penalty? For now just ignore or reset
        }
    };

    return (
        <div className="flex flex-col h-full w-full absolute inset-0 bg-gray-900">
            {/* Player 2 (Top, Rotated) */}
            <div 
                className={`flex-1 flex items-center justify-center rotate-180 border-b-4 border-white/20 active:bg-gray-800 transition-colors ${gameState === 'go' ? 'bg-green-900/30' : ''}`}
                onTouchStart={() => handleTap(2)}
                onMouseDown={() => handleTap(2)}
            >
                <div className="text-center">
                    <div className="text-4xl font-black text-red-400 mb-2">بازیکن ۲</div>
                    <div className="text-2xl text-white">امتیاز: {scoreP2}</div>
                    {winner === 2 && <div className="text-green-400 text-3xl font-bold mt-2">برنده! 🏆</div>}
                </div>
            </div>

            {/* Center Indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white
                    ${gameState === 'waiting' ? 'bg-red-500 text-white' : 
                      gameState === 'ready' ? 'bg-yellow-500 text-black' : 
                      gameState === 'go' ? 'bg-green-500 text-white' : 'bg-gray-700'}`}>
                    {gameState === 'waiting' ? '...' : 
                     gameState === 'ready' ? 'آماده' : 
                     gameState === 'go' ? 'شلیک!' : '...'}
                </div>
            </div>

            {/* Player 1 (Bottom) */}
            <div 
                className={`flex-1 flex items-center justify-center border-t-4 border-white/20 active:bg-gray-800 transition-colors ${gameState === 'go' ? 'bg-green-900/30' : ''}`}
                onTouchStart={() => handleTap(1)}
                onMouseDown={() => handleTap(1)}
            >
                <div className="text-center">
                    <div className="text-4xl font-black text-blue-400 mb-2">بازیکن ۱</div>
                    <div className="text-2xl text-white">امتیاز: {scoreP1}</div>
                    {winner === 1 && <div className="text-green-400 text-3xl font-bold mt-2">برنده! 🏆</div>}
                </div>
            </div>
            
            <button onClick={() => onGameOver(Math.max(scoreP1, scoreP2) * 100)} className="absolute top-4 left-4 z-30 p-2 bg-black/50 rounded-full text-white">❌</button>
        </div>
    );
};

// --- Multiplayer: 2. Finger Sumo (2 Player) ---
export const SumoGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [position, setPosition] = useState(50); // 0 to 100. 50 is center.
    const [winner, setWinner] = useState<number | null>(null);

    const handleTap = (player: number) => {
        if (winner) return;
        setPosition(p => {
            const shift = 4; // Power of each tap
            let newPos = player === 1 ? p + shift : p - shift; // P1 pushes up (increases?), P2 pushes down
            // Actually let's say P1 is Bottom (pushing up -> increase?), P2 is Top (pushing down -> decrease?)
            // Let's visualize: 0 is Top (P2 Base), 100 is Bottom (P1 Base).
            // P1 wants to push to 0. P2 wants to push to 100.
            
            if (player === 1) newPos = p - shift;
            else newPos = p + shift;

            if (newPos <= 0) setWinner(1);
            if (newPos >= 100) setWinner(2);
            return Math.max(0, Math.min(100, newPos));
        });
        sfx.playTone(100 + position * 2, 'sawtooth', 0.05);
    };

    return (
        <div className="flex flex-col h-full w-full absolute inset-0 bg-gray-900 overflow-hidden">
             {/* P2 Zone (Top) */}
             <div 
                className="flex-1 bg-red-900/50 flex items-start justify-center pt-10 active:bg-red-800/50 transition-colors relative"
                onMouseDown={() => handleTap(2)}
                onTouchStart={() => handleTap(2)}
             >
                <div className="rotate-180 text-center pointer-events-none select-none">
                    <div className="text-3xl font-black text-red-200">بازیکن ۲</div>
                    <div className="text-sm text-red-400">سریع ضربه بزن!</div>
                </div>
                {winner === 2 && <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-4xl font-bold z-20">WINNER</div>}
             </div>

             {/* Sumo Ring Indicator */}
             <div className="h-4 w-full bg-gray-700 relative">
                 <div 
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-[0_0_15px_white] transition-all duration-75"
                    style={{ top: `${position}%`, left: '50%', transform: 'translate(-50%, -50%)' }}
                 />
                 {/* Visual Bar */}
                 <div className="absolute left-1/2 -translate-x-1/2 w-full h-[500%] opacity-20 pointer-events-none bg-gradient-to-b from-red-500 to-blue-500" style={{top: '-200%'}} />
             </div>

             {/* P1 Zone (Bottom) */}
             <div 
                className="flex-1 bg-blue-900/50 flex items-end justify-center pb-10 active:bg-blue-800/50 transition-colors relative"
                onMouseDown={() => handleTap(1)}
                onTouchStart={() => handleTap(1)}
             >
                 <div className="text-center pointer-events-none select-none">
                    <div className="text-3xl font-black text-blue-200">بازیکن ۱</div>
                    <div className="text-sm text-blue-400">سریع ضربه بزن!</div>
                </div>
                {winner === 1 && <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-4xl font-bold z-20">WINNER</div>}
             </div>

             <button onClick={() => onGameOver(100)} className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-2 bg-black/50 rounded-full text-white">❌</button>
        </div>
    );
};

// --- Multiplayer: 3. Tap War (4 Player) ---
export const TapWarGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [scores, setScores] = useState([25, 25, 25, 25]); // Percentages
    const [winner, setWinner] = useState<number | null>(null);

    const handleTap = (pIdx: number) => {
        if (winner !== null) return;
        setScores(prev => {
            const newScores = [...prev];
            // Increase this player, decrease others
            newScores[pIdx] += 3;
            for(let i=0; i<4; i++) {
                if (i !== pIdx) newScores[i] -= 1;
            }
            
            // Normalize and Check Win
            const total = newScores.reduce((a,b) => Math.max(0, a) + Math.max(0, b), 0);
            if (total === 0) return prev; // Avoid /0

            // Check if anyone reached > 90% dominance (simple win condition)
            if (newScores[pIdx] > 90) setWinner(pIdx);

            return newScores; 
        });
        sfx.playTone(200 + pIdx * 100, 'sine', 0.05);
    };

    const colors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-500'];
    const labels = ['قرمز', 'آبی', 'سبز', 'زرد'];

    return (
        <div className="absolute inset-0 w-full h-full flex flex-wrap bg-gray-900">
            {winner !== null && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
                    <div className="text-5xl font-black text-white animate-bounce">
                        {labels[winner]} برد! 👑
                    </div>
                    <button onClick={() => onGameOver(100)} className="absolute bottom-20 px-8 py-3 bg-white text-black rounded-xl font-bold">خروج</button>
                </div>
            )}
            
            {[0, 1, 2, 3].map((i) => (
                <div 
                    key={i}
                    className={`w-1/2 h-1/2 border border-white/10 relative active:brightness-110 transition-all duration-100 overflow-hidden ${colors[i]}`}
                    onTouchStart={(e) => { e.preventDefault(); handleTap(i); }}
                    onMouseDown={(e) => { e.preventDefault(); handleTap(i); }}
                    style={{ flexBasis: '50%' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div 
                            className="bg-white/20 rounded-full transition-all duration-200"
                            style={{ width: `${scores[i]*2}%`, height: `${scores[i]*2}%` }}
                        />
                        <span className="relative z-10 text-2xl font-black text-white/80 mix-blend-overlay">{Math.round(scores[i])}%</span>
                    </div>
                </div>
            ))}
             <button onClick={() => onGameOver(0)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 p-4 bg-black/50 rounded-full text-white text-xs">خروج</button>
        </div>
    );
};

// ... Include other single player games ...
// Re-exporting Single Player games for brevity, assume they are same as before but need to be present
// I will just paste the FULL content of Games.tsx to ensure nothing is missing.

export const SnakeGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [dir, setDir] = useState([0, 0]);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (!started) return;
    setSnake((prev) => {
      const newHead = [prev[0][0] + dir[0], prev[0][1] + dir[1]];
      
      if (newHead[0] < 0 || newHead[0] >= 20 || newHead[1] < 0 || newHead[1] >= 20) {
        onGameOver(score);
        return prev;
      }
      if (prev.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])) {
        onGameOver(score);
        return prev;
      }

      const newSnake = [newHead, ...prev];
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore(s => s + 10);
        sfx.playSuccess();
        setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [dir, food, started, score, onGameOver]);

  useEffect(() => {
    const int = setInterval(moveSnake, 150);
    return () => clearInterval(int);
  }, [moveSnake]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!started) setStarted(true);
      switch(e.key) {
        case 'ArrowUp': if(dir[1] !== 1) setDir([0, -1]); break;
        case 'ArrowDown': if(dir[1] !== -1) setDir([0, 1]); break;
        case 'ArrowLeft': if(dir[0] !== 1) setDir([-1, 0]); break;
        case 'ArrowRight': if(dir[0] !== -1) setDir([1, 0]); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [started, dir]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-xl">امتیاز: {score}</div>
      <div className="grid grid-cols-[repeat(20,12px)] sm:grid-cols-[repeat(20,15px)] grid-rows-[repeat(20,12px)] sm:grid-rows-[repeat(20,15px)] gap-px bg-gray-800/80 backdrop-blur-sm border-4 border-green-500/50 rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.3)]">
        {Array.from({ length: 400 }).map((_, i) => {
          const x = i % 20;
          const y = Math.floor(i / 20);
          const isSnake = snake.some(s => s[0] === x && s[1] === y);
          const isFood = food[0] === x && food[1] === y;
          return (
            <div key={i} className={`w-full h-full rounded-[1px] ${isSnake ? 'bg-green-400 shadow-[0_0_5px_#4ade80]' : isFood ? 'bg-red-500 animate-pulse rounded-full' : 'bg-white/5'}`} />
          );
        })}
      </div>
       {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-4 md:hidden scale-90">
         <div />
         <button className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full active:bg-green-600" onClick={() => { if(!started) setStarted(true); setDir([0, -1]) }}>⬆️</button>
         <div />
         <button className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full active:bg-green-600" onClick={() => { if(!started) setStarted(true); setDir([-1, 0]) }}>⬅️</button>
         <button className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full active:bg-green-600" onClick={() => { if(!started) setStarted(true); setDir([0, 1]) }}>⬇️</button>
         <button className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full active:bg-green-600" onClick={() => { if(!started) setStarted(true); setDir([1, 0]) }}>➡️</button>
      </div>
    </div>
  );
};
export const MemoryGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [cards, setCards] = useState<{id: number, val: string, flipped: boolean, matched: boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const emojis = ['🚀', '🌟', '🎮', '🎲', '🎨', '🎸', '🍕', '🐱'];
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((val, id) => ({ id, val, flipped: false, matched: false }));
    setCards(deck);
  }, []);

  const handleFlip = (id: number) => {
    if (flipped.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (card?.flipped || card?.matched) return;

    sfx.playClick();
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    setFlipped([...flipped, id]);

    if (flipped.length === 1) {
      const firstId = flipped[0];
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === id);

      if (firstCard?.val === secondCard?.val) {
        sfx.playSuccess();
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstId || c.id === id) ? { ...c, matched: true } : c));
          setFlipped([]);
          setScore(s => s + 100);
          if (newCards.filter(c => !c.matched).length <= 2) {
             setTimeout(() => onGameOver(score + 100 + 500), 1000); 
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === firstId || c.id === id) ? { ...c, flipped: false } : c));
          setFlipped([]);
          setScore(s => Math.max(0, s - 10));
        }, 1000);
      }
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4 text-2xl font-bold text-blue-400">امتیاز: {score}</div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <motion.div
            key={card.id}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl cursor-pointer rounded-xl select-none shadow-lg
              ${card.flipped || card.matched ? 'bg-indigo-600 shadow-indigo-500/50' : 'bg-gray-700 hover:bg-gray-600 border border-white/10'}`}
            onClick={() => handleFlip(card.id)}
          >
            <div style={{ transform: 'rotateY(180deg)' }}>
              {(card.flipped || card.matched) ? card.val : ''}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export const MathGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setProblem(`${a} ${op} ${b}`);
    // eslint-disable-next-line no-eval
    setAnswer(eval(`${a} ${op} ${b}`));
    setInput('');
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          onGameOver(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onGameOver, score]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(input) === answer) {
      setScore(s => s + 50 + timeLeft);
      sfx.playSuccess();
      setTimeLeft(t => Math.min(t + 2, 30)); 
      generateProblem();
    } else {
      sfx.playFailure();
      setTimeLeft(t => Math.max(0, t - 5));
      setInput('');
    }
  };

  return (
    <div className="text-center w-full max-w-sm px-4">
      <div className="flex justify-between mb-4 text-xl font-bold">
        <span className="text-yellow-400">زمان: {timeLeft}s</span>
        <span>امتیاز: {score}</span>
      </div>
      <div className="text-4xl font-black mb-4 p-6 bg-gray-800/80 backdrop-blur rounded-2xl border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20">
        {problem} = ?
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          readOnly
          value={input}
          className="w-full bg-gray-700 text-white text-3xl text-center p-3 rounded-xl focus:ring-4 focus:ring-yellow-500 outline-none mb-4 pointer-events-none"
          placeholder="پاسخ"
        />
      </form>
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9,0,'-','DEL'].map(n => (
            <button 
                key={n} 
                type="button"
                onClick={() => {
                    if(n === 'DEL') setInput(prev => prev.slice(0, -1));
                    else setInput(prev => prev + n);
                }}
                className="p-3 bg-gray-700/80 rounded-lg text-xl font-bold hover:bg-gray-600 active:bg-yellow-600 transition-colors"
            >
                {n === 'DEL' ? '⌫' : n}
            </button>
        ))}
        <button onClick={handleSubmit} className="col-span-3 p-3 bg-green-600 rounded-lg font-bold mt-2">ثبت پاسخ</button>
      </div>
    </div>
  );
};
export const ReflexGame: React.FC<GameProps> = ({ onGameOver }) => {
  const [state, setState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [message, setMessage] = useState('برای شروع کلیک کنید');
  const [attempts, setAttempts] = useState(0);
  const [avgTime, setAvgTime] = useState(0);

  const startRound = () => {
    setState('waiting');
    setMessage('صبر کن...');
    const delay = 1000 + Math.random() * 3000;
    setTimeout(() => {
        setState('click');
        setMessage('الان کلیک کن!');
        setStartTime(performance.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'ready') {
      startRound();
    } else if (state === 'waiting') {
      setMessage('زود زدی! دوباره');
      sfx.playFailure();
      setState('ready');
    } else if (state === 'click') {
      const time = performance.now() - startTime;
      sfx.playClick();
      const newAvg = (avgTime * attempts + time) / (attempts + 1);
      setAvgTime(newAvg);
      setAttempts(a => a + 1);
      setMessage(`${Math.round(time)}ms`);
      setState('ready');
      
      if (attempts >= 4) {
          setTimeout(() => {
              onGameOver(Math.round(100000 / newAvg));
          }, 1500);
      }
    }
  };

  useEffect(() => {
      setState('ready');
  }, []);

  let bgColor = 'bg-gray-700';
  if (state === 'waiting') bgColor = 'bg-red-600';
  if (state === 'click') bgColor = 'bg-green-500';

  return (
    <div 
        className={`w-64 h-64 rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-100 ${bgColor} shadow-2xl border-4 border-white/10`}
        onMouseDown={handleClick}
    >
        <div className="text-2xl font-bold select-none text-white drop-shadow-md text-center px-4">{message}</div>
        {attempts > 0 && <div className="mt-2 text-white/70 text-sm">میانگین: {Math.round(avgTime)}ms ({attempts}/5)</div>}
    </div>
  );
};
export const TriviaGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
    const [currIndex, setCurrIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

    useEffect(() => {
        const load = async () => {
            const qs = await generateTriviaQuestions('General Knowledge');
            setQuestions(qs);
            setLoading(false);
        };
        load();
    }, []);

    const handleAnswer = (idx: number) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);
        
        if (idx === questions[currIndex].correctAnswerIndex) {
            sfx.playSuccess();
            setScore(s => s + 200);
        } else {
            sfx.playFailure();
        }

        setTimeout(() => {
            if (currIndex < questions.length - 1) {
                setCurrIndex(c => c + 1);
                setSelectedOpt(null);
            } else {
                onGameOver(score + (idx === questions[currIndex].correctAnswerIndex ? 200 : 0));
            }
        }, 1500);
    };

    if (loading) return <div className="flex flex-col items-center p-10 bg-gray-900/50 rounded-xl"><Loader2 className="animate-spin w-12 h-12 text-purple-500 mb-4" /><p>در حال دریافت سوال...</p></div>;

    const q = questions[currIndex];

    return (
        <div className="w-full max-w-md">
            <div className="flex justify-between mb-4 text-purple-300 text-sm">
                <span>سوال {currIndex + 1}/{questions.length}</span>
                <span>امتیاز: {score}</span>
            </div>
            <div className="bg-purple-900/60 backdrop-blur p-4 rounded-xl mb-4 min-h-[100px] flex items-center justify-center text-center text-lg font-bold border border-purple-500/30">
                {q.question}
            </div>
            <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, i) => {
                    let btnClass = "bg-gray-800/80 hover:bg-gray-700";
                    if (selectedOpt !== null) {
                        if (i === q.correctAnswerIndex) btnClass = "bg-green-600";
                        else if (i === selectedOpt) btnClass = "bg-red-600";
                        else btnClass = "opacity-50 bg-gray-800";
                    }
                    return (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className={`p-3 rounded-lg text-right transition-all duration-300 ${btnClass} font-medium border border-white/5 text-sm`}
                        >
                            {opt}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
export const WhackGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [grid, setGrid] = useState<boolean[]>(Array(9).fill(false));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
        const int = setInterval(() => {
            setGrid(() => {
                const newGrid = Array(9).fill(false);
                const count = Math.random() > 0.7 ? 2 : 1;
                for(let i=0; i<count; i++) {
                    newGrid[Math.floor(Math.random() * 9)] = true;
                }
                return newGrid;
            });
        }, 700);
        
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if(t<=1) {
                    clearInterval(timer);
                    clearInterval(int);
                    onGameOver(score);
                    return 0;
                }
                return t-1;
            });
        }, 1000);

        return () => { clearInterval(int); clearInterval(timer); };
    }, [onGameOver, score]);

    const whack = (idx: number) => {
        if (grid[idx]) {
            sfx.playClick();
            setScore(s => s + 50);
            setGrid(g => {
                const ng = [...g];
                ng[idx] = false;
                return ng;
            });
        } else {
            setScore(s => Math.max(0, s - 20));
        }
    };

    return (
        <div className="text-center">
             <div className="flex justify-between mb-4 text-lg font-bold w-full max-w-xs mx-auto text-orange-400">
                <span>زمان: {timeLeft}s</span>
                <span>امتیاز: {score}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mx-auto max-w-[250px]">
                {grid.map((active, i) => (
                    <button
                        key={i}
                        onMouseDown={() => whack(i)}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-100
                            ${active ? 'bg-orange-500 -translate-y-1 shadow-lg shadow-orange-500/50' : 'bg-gray-800 inner-shadow border border-white/5'}`}
                    >
                        <AnimatePresence>
                            {active && <motion.span initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>🐹</motion.span>}
                        </AnimatePresence>
                    </button>
                ))}
            </div>
        </div>
    );
};
export const SimonGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSeq, setPlayerSeq] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [activeColor, setActiveColor] = useState<number | null>(null);
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
    const sounds = [300, 400, 500, 600];

    const playSequence = async (seq: number[]) => {
        setPlaying(true);
        setPlayerSeq([]);
        await new Promise(r => setTimeout(r, 800));
        
        for (const idx of seq) {
            setActiveColor(idx);
            sfx.playTone(sounds[idx], 'sine', 0.3);
            await new Promise(r => setTimeout(r, 400));
            setActiveColor(null);
            await new Promise(r => setTimeout(r, 150));
        }
        setPlaying(false);
    };

    useEffect(() => {
        const first = Math.floor(Math.random() * 4);
        setSequence([first]);
        playSequence([first]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = (idx: number) => {
        if (playing) return;
        sfx.playTone(sounds[idx], 'sine', 0.2);
        
        const newPlayerSeq = [...playerSeq, idx];
        setPlayerSeq(newPlayerSeq);

        if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
            sfx.playFailure();
            onGameOver(score);
            return;
        }

        if (newPlayerSeq.length === sequence.length) {
            setScore(s => s + 100);
            sfx.playSuccess();
            setTimeout(() => {
                const next = Math.floor(Math.random() * 4);
                const newSeq = [...sequence, next];
                setSequence(newSeq);
                playSequence(newSeq);
            }, 800);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-xl font-bold text-cyan-400">دور: {sequence.length} | امتیاز: {score}</div>
            <div className="grid grid-cols-2 gap-3">
                {colors.map((bg, i) => (
                    <motion.button
                        key={i}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleClick(i)}
                        className={`w-24 h-24 rounded-2xl ${bg} ${activeColor === i ? 'brightness-150 shadow-[0_0_30px_rgba(255,255,255,0.5)] scale-105' : 'opacity-80'}`}
                    />
                ))}
            </div>
            <div className="mt-4 text-gray-400 text-sm">{playing ? 'گوش کنید...' : 'تکرار کنید'}</div>
        </div>
    );
};
export const ColorMatchGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [current, setCurrent] = useState({ text: 'Red', color: 'red', match: true });

    const colors = [
        { name: 'قرمز', code: 'text-red-500', val: 'red' },
        { name: 'آبی', code: 'text-blue-500', val: 'blue' },
        { name: 'سبز', code: 'text-green-500', val: 'green' },
        { name: 'زرد', code: 'text-yellow-500', val: 'yellow' },
    ];

    const generate = () => {
        const textIdx = Math.floor(Math.random() * 4);
        const shouldMatch = Math.random() > 0.5;
        let colorIdx = textIdx;
        
        if (!shouldMatch) {
            do {
                colorIdx = Math.floor(Math.random() * 4);
            } while (colorIdx === textIdx);
        }

        setCurrent({
            text: colors[textIdx].name,
            color: colors[colorIdx].code,
            match: textIdx === colorIdx
        });
    };

    useEffect(() => {
        generate();
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    onGameOver(score);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleVote = (vote: boolean) => {
        if (vote === current.match) {
            setScore(s => s + 50);
            sfx.playClick();
            generate();
        } else {
            sfx.playFailure();
            onGameOver(score);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-xs">
            <div className="w-full flex justify-between mb-4 text-lg font-bold">
                 <span>زمان: {timeLeft}</span>
                 <span>امتیاز: {score}</span>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl mb-6 w-full text-center backdrop-blur-md">
                <div className="text-gray-400 mb-2 text-xs">آیا متن با رنگ همخوانی دارد؟</div>
                <div className={`text-5xl font-black ${current.color} drop-shadow-md`}>{current.text}</div>
            </div>
            <div className="flex gap-4 w-full">
                <button onClick={() => handleVote(false)} className="flex-1 bg-red-600 hover:bg-red-500 p-4 rounded-xl font-bold text-xl">خیر</button>
                <button onClick={() => handleVote(true)} className="flex-1 bg-green-600 hover:bg-green-500 p-4 rounded-xl font-bold text-xl">بله</button>
            </div>
        </div>
    );
};
export const ClickerGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [count, setCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    setActive(false);
                    onGameOver(count * 10);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        setActive(true);
        return () => clearInterval(timer);
    }, []);

    const click = () => {
        if (!active) return;
        setCount(c => c + 1);
        sfx.playTone(200 + (count * 10), 'triangle', 0.05, 0.05);
    };

    return (
        <div className="text-center">
            <h2 className="text-xl mb-4 font-bold text-lime-400">سریع کلیک کن!</h2>
            <div className="text-2xl mb-8">زمان: {timeLeft}s | تعداد: {count}</div>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={click}
                className="w-40 h-40 rounded-full bg-gradient-to-tr from-lime-500 to-green-600 shadow-[0_0_50px_rgba(132,204,22,0.4)] flex items-center justify-center text-4xl font-black border-4 border-white/20"
            >
                TAP!
            </motion.button>
        </div>
    );
};
export const BreathingGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [phase, setPhase] = useState('دم');
    const [scale, setScale] = useState(1);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const cycle = async () => {
            setPhase('نفس بکش');
            setScale(2);
            await new Promise(r => setTimeout(r, 4000));
            setScore(s => s + 10);
            
            setPhase('حبس');
            await new Promise(r => setTimeout(r, 4000));
            setScore(s => s + 10);

            setPhase('تخلیه');
            setScale(1);
            await new Promise(r => setTimeout(r, 4000));
            setScore(s => s + 10);
        };

        const interval = setInterval(cycle, 12000);
        cycle();

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-8 text-lg font-light text-teal-300">امتیاز: {score}</div>
            <motion.div
                animate={{ scale: scale }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-300 to-blue-500 blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.5)]"
            >
                <div className="w-full h-full bg-white/20 rounded-full" />
            </motion.div>
            <div className="mt-10 text-2xl font-bold text-white tracking-widest">{phase}</div>
            <button 
                onClick={() => onGameOver(score)} 
                className="mt-8 text-xs text-gray-500 hover:text-white border-b border-gray-600 pb-1"
            >
                پایان
            </button>
        </div>
    );
};
export const TicTacToeGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (winner || board[i]) return;
        const newBoard = [...board];
        newBoard[i] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        
        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            sfx.playSuccess();
            setTimeout(() => onGameOver(win === 'X' ? 100 : 50), 1000);
        } else if (!newBoard.includes(null)) {
            // Draw
            setTimeout(() => onGameOver(20), 1000);
        } else {
            setIsXNext(!isXNext);
            sfx.playClick();
        }
    };

    // Simple AI for O
    useEffect(() => {
        if (!isXNext && !winner && board.includes(null)) {
            const timer = setTimeout(() => {
                const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
                const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                handleClick(randomMove);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isXNext, winner, board]);

    return (
        <div className="flex flex-col items-center">
            <h2 className="mb-6 text-xl font-bold">نوبت: {isXNext ? 'شما (X)' : 'ربات (O)'}</h2>
            <div className="grid grid-cols-3 gap-2 bg-gray-700 p-2 rounded-xl">
                {board.map((val, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleClick(i)}
                        className="w-20 h-20 bg-gray-800 rounded-lg text-4xl flex items-center justify-center font-bold hover:bg-gray-750 transition-colors"
                    >
                        {val === 'X' && <span className="text-blue-400">✕</span>}
                        {val === 'O' && <span className="text-red-400">○</span>}
                    </button>
                ))}
            </div>
        </div>
    );
};
export const RPSGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [score, setScore] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [message, setMessage] = useState('انتخاب کنید');
    
    const choices = [
        { id: 'r', label: 'سنگ', icon: Circle }, // Circle as Rock
        { id: 'p', label: 'کاغذ', icon: Square }, // Square as Paper
        { id: 's', label: 'قیچی', icon: Scissors }
    ];

    const play = (userChoice: string) => {
        const aiChoice = choices[Math.floor(Math.random() * 3)].id;
        let resultScore = 0;
        let msg = '';

        if (userChoice === aiChoice) {
            msg = 'مساوی!';
            resultScore = 10;
        } else if (
            (userChoice === 'r' && aiChoice === 's') ||
            (userChoice === 'p' && aiChoice === 'r') ||
            (userChoice === 's' && aiChoice === 'p')
        ) {
            msg = 'بردی!';
            resultScore = 50;
            sfx.playSuccess();
        } else {
            msg = 'باختی!';
            sfx.playFailure();
        }

        setScore(s => s + resultScore);
        setMessage(`حریف: ${aiChoice === 'r' ? 'سنگ' : aiChoice === 'p' ? 'کاغذ' : 'قیچی'} - ${msg}`);
        setRounds(r => r + 1);

        if (rounds >= 4) {
            setTimeout(() => onGameOver(score + resultScore), 1500);
        }
    };

    return (
        <div className="text-center w-full max-w-sm">
             <div className="mb-8 text-xl">دور: {rounds+1}/5 | امتیاز: {score}</div>
             <div className="h-24 flex items-center justify-center text-2xl font-bold mb-8 bg-white/5 rounded-xl border border-white/10 p-4">
                 {message}
             </div>
             <div className="flex justify-center gap-4">
                 {choices.map(c => (
                     <button
                        key={c.id}
                        onClick={() => play(c.id)}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-colors w-24"
                     >
                         <c.icon size={32} />
                         <span>{c.label}</span>
                     </button>
                 ))}
             </div>
        </div>
    );
};
export const TypingGame: React.FC<GameProps> = ({ onGameOver }) => {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon'];
    const [target, setTarget] = useState('');
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        setTarget(words[Math.floor(Math.random() * words.length)]);
    }, []);

    useEffect(() => {
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(t);
                    onGameOver(score);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [score, onGameOver]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);
        if (val.toLowerCase() === target) {
            sfx.playSuccess();
            setScore(s => s + target.length * 10);
            setTarget(words[Math.floor(Math.random() * words.length)]);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-sm">
             <div className="flex justify-between w-full mb-6 text-xl font-bold text-sky-400">
                <span>زمان: {timeLeft}s</span>
                <span>امتیاز: {score}</span>
            </div>
            <div className="text-4xl font-bold mb-6 tracking-wider">{target}</div>
            <input 
                autoFocus
                value={input}
                onChange={handleChange}
                className="bg-gray-800 border-2 border-sky-500 rounded-lg p-3 text-center text-2xl w-full outline-none"
                placeholder="تایپ کنید..."
            />
        </div>
    );
};
export const GuessNumberGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [target, setTarget] = useState(0);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('یک عدد بین 1 تا 100');
    const [attempts, setAttempts] = useState(0);
    const [score, setScore] = useState(100);

    useEffect(() => {
        setTarget(Math.floor(Math.random() * 100) + 1);
    }, []);

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(guess);
        setAttempts(a => a + 1);
        
        if (num === target) {
            sfx.playSuccess();
            setMessage('آفرین! درست بود');
            setTimeout(() => onGameOver(score), 1000);
        } else {
            sfx.playFailure();
            setScore(s => Math.max(0, s - 10));
            if (num < target) setMessage('بیشتر!');
            else setMessage('کمتر!');
            setGuess('');
        }
    };

    return (
        <div className="text-center w-full max-w-xs">
            <h2 className="text-xl mb-4 font-bold text-amber-400">حدس عدد (1-100)</h2>
            <div className="mb-6 bg-gray-800 p-4 rounded-lg text-lg min-h-[60px] flex items-center justify-center">
                {message}
            </div>
            <form onSubmit={handleGuess} className="flex gap-2">
                <input 
                    type="number"
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    className="flex-1 bg-gray-700 rounded-lg p-3 text-center text-2xl outline-none"
                    placeholder="؟"
                    autoFocus
                />
                <button type="submit" className="bg-amber-600 px-6 py-2 rounded-lg font-bold">حدس</button>
            </form>
            <div className="mt-4 text-sm text-gray-500">تلاش‌ها: {attempts}</div>
        </div>
    );
};
export const OddOneOutGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gridSize, setGridSize] = useState(2);
    const [oddIndex, setOddIndex] = useState(0);
    const [emoji, setEmoji] = useState('😀');
    const [oddEmoji, setOddEmoji] = useState('😃');
    const [timeLeft, setTimeLeft] = useState(15);

    const generateLevel = () => {
        const size = Math.min(6, Math.floor(level / 2) + 2);
        setGridSize(size);
        const count = size * size;
        setOddIndex(Math.floor(Math.random() * count));
        
        const emojis = [['😀','😃'], ['🐶','🐕'], ['🍎','🍅'], ['🌑','🌒']];
        const pair = emojis[Math.floor(Math.random() * emojis.length)];
        setEmoji(pair[0]);
        setOddEmoji(pair[1]);
    };

    useEffect(() => {
        generateLevel();
    }, [level]);

    useEffect(() => {
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(t);
                    onGameOver(score);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [score, onGameOver]);

    const handleClick = (index: number) => {
        if (index === oddIndex) {
            sfx.playSuccess();
            setScore(s => s + 50);
            setLevel(l => l + 1);
            setTimeLeft(t => Math.min(t + 2, 20));
        } else {
            sfx.playFailure();
            onGameOver(score);
        }
    };

    return (
        <div className="flex flex-col items-center">
             <div className="flex justify-between w-full max-w-xs mb-4 text-lg font-bold text-fuchsia-400">
                <span>زمان: {timeLeft}s</span>
                <span>امتیاز: {score}</span>
            </div>
            <div 
                className="grid gap-1 bg-gray-800 p-2 rounded-lg"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-700/50 hover:bg-gray-700 rounded text-3xl flex items-center justify-center"
                    >
                        {i === oddIndex ? oddEmoji : emoji}
                    </button>
                ))}
            </div>
            <p className="mt-4 text-gray-500 text-sm">شکل متفاوت را پیدا کنید</p>
        </div>
    );
};
export const GolYaPoochGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('گل توی کدوم دسته؟');
    const [revealed, setRevealed] = useState<number | null>(null); // 0 = left, 1 = right
    const [flowerPos, setFlowerPos] = useState<number>(0);
    const [round, setRound] = useState(1);

    useEffect(() => {
        setFlowerPos(Math.random() > 0.5 ? 1 : 0);
    }, [round]);

    const handleGuess = (guess: number) => {
        if (revealed !== null) return;
        setRevealed(flowerPos);
        
        if (guess === flowerPos) {
            sfx.playSuccess();
            setMessage('آفرین! گل بود 🌸');
            setScore(s => s + 50);
            setTimeout(() => {
                if(round >= 5) onGameOver(score + 50);
                else {
                    setRound(r => r + 1);
                    setRevealed(null);
                    setMessage('دوباره حدس بزن');
                }
            }, 1500);
        } else {
            sfx.playFailure();
            setMessage('پوچ بود! 💨');
            setTimeout(() => onGameOver(score), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-sm">
            <div className="mb-8 text-xl text-amber-300 font-bold">دور {round}/5 | امتیاز: {score}</div>
            <div className="h-20 mb-8 text-2xl font-bold flex items-center">{message}</div>
            <div className="flex gap-8">
                {[0, 1].map((side) => (
                    <motion.button
                        key={side}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleGuess(side)}
                        className="w-32 h-32 rounded-full bg-amber-800 border-4 border-amber-600 flex items-center justify-center text-6xl shadow-xl relative overflow-hidden"
                    >
                        <AnimatePresence>
                            {revealed !== null && side === revealed ? (
                                <motion.span 
                                    initial={{ opacity: 0, scale: 0 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-green-800/80"
                                >
                                    🌸
                                </motion.span>
                            ) : revealed !== null ? (
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white text-sm font-bold"
                                >
                                    پوچ
                                </motion.span>
                            ) : (
                                <span>✊</span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
export const YaldaCatchGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [items, setItems] = useState<{id: number, x: number, y: number, type: 'good' | 'bad'}[]>([]);
    const [score, setScore] = useState(0);
    const [playerPos, setPlayerPos] = useState(1); // 0, 1, 2 (Three lanes)
    const [timeLeft, setTimeLeft] = useState(30);

    // Game loop
    useEffect(() => {
        const interval = setInterval(() => {
            setItems(prev => {
                // Move items down
                const moved = prev.map(item => ({ ...item, y: item.y + 5 }));
                
                // Remove items that fell off
                const kept = moved.filter(item => item.y < 100);
                
                // Add new item randomly
                if (Math.random() < 0.1) {
                    kept.push({
                        id: Date.now() + Math.random(),
                        x: Math.floor(Math.random() * 3),
                        y: 0,
                        type: Math.random() > 0.3 ? 'good' : 'bad'
                    });
                }
                return kept;
            });
        }, 50);

        const timer = setInterval(() => setTimeLeft(t => {
            if (t <= 1) {
                clearInterval(timer);
                clearInterval(interval);
                onGameOver(score);
                return 0;
            }
            return t - 1;
        }), 1000);

        return () => { clearInterval(interval); clearInterval(timer); };
    }, [score, onGameOver]);

    // Collision detection
    useEffect(() => {
        setItems(prev => {
            const caught = prev.filter(item => item.y > 85 && item.y < 95 && item.x === playerPos);
            if (caught.length > 0) {
                caught.forEach(c => {
                    if (c.type === 'good') {
                        setScore(s => s + 20);
                        sfx.playTone(600, 'sine', 0.1);
                    } else {
                        setScore(s => Math.max(0, s - 50));
                        sfx.playFailure();
                    }
                });
                return prev.filter(item => !(item.y > 85 && item.y < 95 && item.x === playerPos));
            }
            return prev;
        });
    }, [items, playerPos]);

    return (
        <div className="w-full max-w-md h-[400px] relative overflow-hidden bg-gray-900 border-2 border-red-900 rounded-xl">
            <div className="absolute top-2 left-2 right-2 flex justify-between text-red-300 font-bold z-10">
                 <span>زمان: {timeLeft}</span>
                 <span>امتیاز: {score}</span>
            </div>
            
            {/* Lanes */}
            <div className="absolute inset-0 grid grid-cols-3 divide-x divide-white/5">
                <div onClick={() => setPlayerPos(0)} className="hover:bg-white/5 transition-colors cursor-pointer" />
                <div onClick={() => setPlayerPos(1)} className="hover:bg-white/5 transition-colors cursor-pointer" />
                <div onClick={() => setPlayerPos(2)} className="hover:bg-white/5 transition-colors cursor-pointer" />
            </div>

            {/* Items */}
            {items.map(item => (
                <div 
                    key={item.id}
                    className="absolute text-3xl transition-all duration-75"
                    style={{ left: `${item.x * 33.33 + 10}%`, top: `${item.y}%` }}
                >
                    {item.type === 'good' ? '🍅' : '💣'}
                </div>
            ))}

            {/* Player Basket */}
            <div 
                className="absolute bottom-2 text-4xl transition-all duration-200"
                style={{ left: `${playerPos * 33.33 + 8}%` }}
            >
                🧺
            </div>
            
            <div className="absolute bottom-20 w-full text-center text-gray-500 text-xs pointer-events-none">
                برای جابجایی روی ستون‌ها کلیک کنید
            </div>
        </div>
    );
};
export const FlagQuizGame: React.FC<GameProps> = ({ onGameOver }) => {
    const flags = [
        { code: 'ir', name: 'Iran' },
        { code: 'de', name: 'Germany' },
        { code: 'fr', name: 'France' },
        { code: 'jp', name: 'Japan' },
        { code: 'br', name: 'Brazil' },
        { code: 'us', name: 'USA' },
        { code: 'gb', name: 'UK' },
        { code: 'it', name: 'Italy' },
        { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' }
    ];

    const [current, setCurrent] = useState<any>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);

    const nextRound = () => {
        if (round >= 5) {
            onGameOver(score);
            return;
        }
        const target = flags[Math.floor(Math.random() * flags.length)];
        const others = flags.filter(f => f.code !== target.code).sort(() => Math.random() - 0.5).slice(0, 3);
        const opts = [target.name, ...others.map(o => o.name)].sort(() => Math.random() - 0.5);
        
        setCurrent(target);
        setOptions(opts);
        setRound(r => r + 1);
    };

    useEffect(() => {
        nextRound();
    }, []);

    const handleAnswer = (ans: string) => {
        if (ans === current.name) {
            sfx.playSuccess();
            setScore(s => s + 100);
        } else {
            sfx.playFailure();
        }
        setTimeout(nextRound, 500);
    };

    if (!current) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center w-full max-w-sm">
             <div className="mb-4 text-xl font-bold text-blue-300">دور {round}/5 | امتیاز: {score}</div>
             <img 
                src={`https://flagcdn.com/w320/${current.code}.png`} 
                alt="Flag" 
                className="w-48 h-auto shadow-lg rounded-lg mb-8 border border-white/20"
             />
             <div className="grid grid-cols-2 gap-3 w-full">
                 {options.map((opt, i) => (
                     <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="p-4 bg-gray-800 hover:bg-blue-600 rounded-xl font-bold transition-colors"
                     >
                         {opt}
                     </button>
                 ))}
             </div>
        </div>
    );
};
export const CapitalQuizGame: React.FC<GameProps> = ({ onGameOver }) => {
    const data = [
        { country: 'Iran', capital: 'Tehran' },
        { country: 'France', capital: 'Paris' },
        { country: 'Germany', capital: 'Berlin' },
        { country: 'Japan', capital: 'Tokyo' },
        { country: 'Italy', capital: 'Rome' },
        { country: 'Spain', capital: 'Madrid' },
        { country: 'Russia', capital: 'Moscow' },
        { country: 'China', capital: 'Beijing' }
    ];

    const [current, setCurrent] = useState<any>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);

    const nextRound = () => {
        if (round >= 5) {
            onGameOver(score);
            return;
        }
        const target = data[Math.floor(Math.random() * data.length)];
        const others = data.filter(d => d.country !== target.country).sort(() => Math.random() - 0.5).slice(0, 3);
        const opts = [target.capital, ...others.map(o => o.capital)].sort(() => Math.random() - 0.5);
        
        setCurrent(target);
        setOptions(opts);
        setRound(r => r + 1);
    };

    useEffect(() => {
        nextRound();
    }, []);

    const handleAnswer = (ans: string) => {
        if (ans === current.capital) {
            sfx.playSuccess();
            setScore(s => s + 100);
        } else {
            sfx.playFailure();
        }
        setTimeout(nextRound, 500);
    };

    if (!current) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center w-full max-w-sm">
             <div className="mb-4 text-xl font-bold text-emerald-300">دور {round}/5 | امتیاز: {score}</div>
             <div className="bg-emerald-900/50 p-8 rounded-full mb-8 w-40 h-40 flex items-center justify-center border-4 border-emerald-600 shadow-lg">
                 <div className="text-center">
                     <MapPin className="mx-auto mb-2 text-emerald-400" size={32} />
                     <div className="font-bold text-xl">{current.country}</div>
                 </div>
             </div>
             <div className="w-full text-center mb-4 text-gray-400">پایتخت کجاست؟</div>
             <div className="grid grid-cols-1 gap-3 w-full">
                 {options.map((opt, i) => (
                     <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="p-3 bg-gray-800 hover:bg-emerald-600 rounded-xl font-bold transition-colors"
                     >
                         {opt}
                     </button>
                 ))}
             </div>
        </div>
    );
};
export const SoccerGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [score, setScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const ballRef = useRef({ x: 50, y: 50, vx: 2, vy: 3 });
    const paddleRef = useRef(50);
    const aiPaddleRef = useRef(50);
    const requestRef = useRef<number>(0);
    const [gameStarted, setGameStarted] = useState(false);
    
    // UI Refs
    const ballEl = useRef<HTMLDivElement>(null);
    const playerEl = useRef<HTMLDivElement>(null);
    const aiEl = useRef<HTMLDivElement>(null);

    const update = () => {
        const ball = ballRef.current;
        
        // Physics
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Walls
        if (ball.x <= 0 || ball.x >= 100) ball.vx *= -1;

        // AI Logic
        const diff = ball.x - aiPaddleRef.current;
        aiPaddleRef.current += diff * 0.1;
        
        // Collisions
        // Player Paddle (Bottom)
        if (ball.y >= 90 && ball.y <= 92 && Math.abs(ball.x - paddleRef.current) < 15) {
             ball.vy *= -1.1; // Speed up
             sfx.playTone(200, 'square', 0.1);
        }
        // AI Paddle (Top)
        if (ball.y <= 10 && ball.y >= 8 && Math.abs(ball.x - aiPaddleRef.current) < 15) {
             ball.vy *= -1.1;
             sfx.playTone(200, 'square', 0.1);
        }

        // Goal
        if (ball.y > 100) {
            setAiScore(s => s + 1);
            sfx.playFailure();
            resetBall();
        } else if (ball.y < 0) {
            setScore(s => s + 1);
            sfx.playSuccess();
            resetBall();
        }

        // Apply visual updates
        if (ballEl.current) ballEl.current.style.left = `${ball.x}%`;
        if (ballEl.current) ballEl.current.style.top = `${ball.y}%`;
        if (aiEl.current) aiEl.current.style.left = `${aiPaddleRef.current}%`;
        
        requestRef.current = requestAnimationFrame(update);
    };

    const resetBall = () => {
        ballRef.current = { x: 50, y: 50, vx: (Math.random() - 0.5) * 4, vy: Math.random() > 0.5 ? 3 : -3 };
    };

    useEffect(() => {
        if (score >= 5) onGameOver(500); // Win
        if (aiScore >= 5) onGameOver(score * 50); // Lose
    }, [score, aiScore, onGameOver]);

    useEffect(() => {
        if(gameStarted) {
             requestRef.current = requestAnimationFrame(update);
             return () => cancelAnimationFrame(requestRef.current);
        }
    }, [gameStarted]);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const width = window.innerWidth > 600 ? 400 : window.innerWidth - 32;
        const offset = (window.innerWidth - width) / 2;
        let pos = ((clientX - offset) / width) * 100;
        pos = Math.max(10, Math.min(90, pos));
        paddleRef.current = pos;
        if (playerEl.current) playerEl.current.style.left = `${pos}%`;
    };

    return (
        <div className="w-full max-w-sm h-[500px] bg-green-800 rounded-xl relative overflow-hidden border-4 border-white/20 shadow-2xl"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* Field Lines */}
            <div className="absolute top-1/2 w-full h-1 bg-white/20 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            {/* Score */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/50 text-2xl font-bold rotate-90">{aiScore} - {score}</div>

            {!gameStarted ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <button onClick={() => setGameStarted(true)} className="px-8 py-4 bg-green-500 rounded-xl font-bold text-xl shadow-lg animate-pulse">شروع بازی</button>
                </div>
            ) : null}

            {/* Elements */}
            <div ref={aiEl} className="absolute top-[5%] w-[20%] h-4 bg-red-500 rounded-full -translate-x-1/2 transition-transform will-change-transform shadow-lg" style={{left: '50%'}} />
            <div ref={playerEl} className="absolute bottom-[5%] w-[20%] h-4 bg-blue-500 rounded-full -translate-x-1/2 transition-transform will-change-transform shadow-lg" style={{left: '50%'}} />
            <div ref={ballEl} className="absolute w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md border border-gray-300" style={{left: '50%', top: '50%'}} />
        </div>
    );
};
export const MazeGame: React.FC<GameProps> = ({ onGameOver }) => {
    // Simple 10x10 Maze (0=Path, 1=Wall)
    const mazeLayout = [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,1],
        [1,1,1,1,1,0,1,0,1,1],
        [1,0,0,0,0,0,1,0,0,1],
        [1,0,1,1,1,1,1,1,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ];
    
    const [pos, setPos] = useState({x: 1, y: 1});
    const [goal, setGoal] = useState({x: 8, y: 7});
    const [score, setScore] = useState(100);

    const move = (dx: number, dy: number) => {
        const nx = pos.x + dx;
        const ny = pos.y + dy;
        if (mazeLayout[ny][nx] === 0) {
            setPos({x: nx, y: ny});
            if (nx === goal.x && ny === goal.y) {
                sfx.playSuccess();
                setTimeout(() => onGameOver(score), 500);
            }
        } else {
            sfx.playTone(100, 'sawtooth', 0.1); // Hit wall
            setScore(s => Math.max(0, s - 5));
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 text-xl font-bold text-amber-400">امتیاز: {score}</div>
            <div className="relative bg-gray-800 p-1 rounded-lg">
                {mazeLayout.map((row, y) => (
                    <div key={y} className="flex">
                        {row.map((cell, x) => (
                            <div key={`${x}-${y}`} 
                                className={`w-8 h-8 ${cell === 1 ? 'bg-amber-900 border border-amber-800' : 'bg-gray-700/50'}`} 
                            />
                        ))}
                    </div>
                ))}
                {/* Player */}
                <div className="absolute w-6 h-6 bg-blue-400 rounded-full transition-all duration-200 shadow-[0_0_10px_#60a5fa]"
                    style={{ left: pos.x * 32 + 4 + 4, top: pos.y * 32 + 4 + 4 }}
                />
                {/* Goal */}
                <div className="absolute w-6 h-6 bg-green-500 rounded-sm animate-pulse shadow-[0_0_10px_#4ade80]"
                    style={{ left: goal.x * 32 + 4 + 4, top: goal.y * 32 + 4 + 4 }}
                >
                    <Goal size={24} className="text-white scale-75" />
                </div>
            </div>
            
            {/* Controls */}
            <div className="grid grid-cols-3 gap-2 mt-6">
                 <div />
                 <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl" onClick={() => move(0, -1)}>⬆️</button>
                 <div />
                 <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl" onClick={() => move(-1, 0)}>⬅️</button>
                 <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl" onClick={() => move(0, 1)}>⬇️</button>
                 <button className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl" onClick={() => move(1, 0)}>➡️</button>
            </div>
        </div>
    );
};
export const RacerGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [lane, setLane] = useState(1); // 0, 1, 2
    const [obstacles, setObstacles] = useState<{id: number, lane: number, y: number}[]>([]);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(1);
    const gameLoop = useRef<any>(null);

    useEffect(() => {
        const loop = () => {
            setObstacles(obs => {
                // Move existing
                const moved = obs.map(o => ({...o, y: o.y + (1.5 * speed)}));
                // Check collision
                for (const o of moved) {
                    if (o.y > 80 && o.y < 95 && o.lane === lane) {
                        sfx.playFailure();
                        clearInterval(gameLoop.current);
                        onGameOver(score);
                        return obs;
                    }
                }
                // Filter out passed
                const filtered = moved.filter(o => {
                    if (o.y > 100) {
                        setScore(s => s + 10);
                        return false;
                    }
                    return true;
                });
                
                // Spawn new
                if (Math.random() < 0.05 * speed) {
                    filtered.push({
                        id: Date.now() + Math.random(),
                        lane: Math.floor(Math.random() * 3),
                        y: -20
                    });
                }
                return filtered;
            });
            setSpeed(s => Math.min(s + 0.001, 3));
        };
        gameLoop.current = setInterval(loop, 20);
        return () => clearInterval(gameLoop.current);
    }, [lane, score, speed, onGameOver]);

    return (
        <div className="w-full max-w-md h-[500px] relative overflow-hidden bg-gray-900 rounded-xl border-4 border-gray-700">
            {/* Road */}
            <div className="absolute inset-0 flex">
                <div className="flex-1 border-r border-dashed border-white/20 relative" onClick={() => setLane(0)}>
                     <div className="absolute inset-0 bg-white/5 animate-[pulse_1s_infinite]" />
                </div>
                <div className="flex-1 border-r border-dashed border-white/20 relative" onClick={() => setLane(1)} />
                <div className="flex-1 relative" onClick={() => setLane(2)} />
            </div>

            {/* Score */}
            <div className="absolute top-4 left-4 text-2xl font-black italic text-red-500 z-10">{score} KM/H</div>

            {/* Obstacles */}
            {obstacles.map(o => (
                <div 
                    key={o.id}
                    className="absolute w-[25%] h-16 bg-red-600 rounded-lg shadow-lg flex items-center justify-center text-2xl z-0"
                    style={{ left: `${o.lane * 33.33 + 4}%`, top: `${o.y}%` }}
                >
                    🚔
                </div>
            ))}

            {/* Player Car */}
            <div 
                className="absolute w-[25%] h-16 bg-yellow-400 rounded-lg shadow-[0_0_20px_#fbbf24] bottom-4 transition-all duration-200 z-10 flex items-center justify-center text-3xl"
                style={{ left: `${lane * 33.33 + 4}%` }}
            >
                🏎️
            </div>
        </div>
    );
};
export const NinjaGame: React.FC<GameProps> = ({ onGameOver }) => {
    const [targets, setTargets] = useState<{id: number, x: number, y: number, vx: number, vy: number, type: 'fruit' | 'bomb', rot: number}[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const loopRef = useRef<number>(0);

    const spawn = () => {
        if (Math.random() > 0.1) return;
        const type = Math.random() > 0.2 ? 'fruit' : 'bomb';
        setTargets(t => [...t, {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: 110,
            vx: (Math.random() - 0.5) * 4,
            vy: - (Math.random() * 2 + 3),
            type,
            rot: 0
        }]);
    };

    const update = () => {
        setTargets(prev => {
            return prev.map(t => ({
                ...t,
                x: t.x + t.vx,
                y: t.y + t.vy,
                vy: t.vy + 0.1, // Gravity
                rot: t.rot + 5
            })).filter(t => t.y < 120);
        });
        spawn();
        loopRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        loopRef.current = requestAnimationFrame(update);
        const timer = setInterval(() => setTimeLeft(t => {
            if(t<=1) {
                onGameOver(score);
                return 0;
            }
            return t-1;
        }), 1000);
        return () => {
            cancelAnimationFrame(loopRef.current);
            clearInterval(timer);
        };
    }, [score, onGameOver]);

    const handleSlice = (id: number, type: 'fruit' | 'bomb') => {
        if (type === 'bomb') {
            sfx.playFailure();
            onGameOver(score);
        } else {
            sfx.playTone(600 + Math.random() * 200, 'sawtooth', 0.1);
            setScore(s => s + 50);
            setTargets(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div className="w-full max-w-sm h-[400px] bg-slate-900 relative overflow-hidden rounded-xl border border-white/10">
            <div className="absolute top-2 left-2 text-purple-400 font-bold">زمان: {timeLeft}</div>
            <div className="absolute top-2 right-2 text-purple-400 font-bold">امتیاز: {score}</div>
            
            {targets.map(t => (
                <div
                    key={t.id}
                    onMouseDown={() => handleSlice(t.id, t.type)}
                    onTouchStart={() => handleSlice(t.id, t.type)}
                    className="absolute w-12 h-12 flex items-center justify-center text-4xl cursor-pointer select-none"
                    style={{ 
                        left: `${t.x}%`, 
                        top: `${t.y}%`,
                        transform: `rotate(${t.rot}deg)` 
                    }}
                >
                    {t.type === 'fruit' ? '🍉' : '💣'}
                </div>
            ))}
        </div>
    );
};
export const GameLoader: React.FC<{gameId: string, onGameOver: (score: number) => void}> = ({ gameId, onGameOver }) => {
    switch(gameId) {
        case 'snake': return <SnakeGame onGameOver={onGameOver} />;
        case 'memory': return <MemoryGame onGameOver={onGameOver} />;
        case 'math': return <MathGame onGameOver={onGameOver} />;
        case 'reflex': return <ReflexGame onGameOver={onGameOver} />;
        case 'trivia': return <TriviaGame onGameOver={onGameOver} />;
        case 'whack': return <WhackGame onGameOver={onGameOver} />;
        case 'simon': return <SimonGame onGameOver={onGameOver} />;
        case 'color_match': return <ColorMatchGame onGameOver={onGameOver} />;
        case 'clicker': return <ClickerGame onGameOver={onGameOver} />;
        case 'breathing': return <BreathingGame onGameOver={onGameOver} />;
        case 'tictactoe': return <TicTacToeGame onGameOver={onGameOver} />;
        case 'rps': return <RPSGame onGameOver={onGameOver} />;
        case 'typing': return <TypingGame onGameOver={onGameOver} />;
        case 'guess': return <GuessNumberGame onGameOver={onGameOver} />;
        case 'odd_one': return <OddOneOutGame onGameOver={onGameOver} />;
        case 'gol_pooch': return <GolYaPoochGame onGameOver={onGameOver} />;
        case 'yalda': return <YaldaCatchGame onGameOver={onGameOver} />;
        case 'flags': return <FlagQuizGame onGameOver={onGameOver} />;
        case 'capitals': return <CapitalQuizGame onGameOver={onGameOver} />;
        case 'soccer': return <SoccerGame onGameOver={onGameOver} />;
        case 'maze': return <MazeGame onGameOver={onGameOver} />;
        case 'racer': return <RacerGame onGameOver={onGameOver} />;
        case 'ninja': return <NinjaGame onGameOver={onGameOver} />;
        case 'duel': return <DuelGame onGameOver={onGameOver} />;
        case 'sumo': return <SumoGame onGameOver={onGameOver} />;
        case 'tap_war': return <TapWarGame onGameOver={onGameOver} />;
        default: return <div className="text-center p-10">Coming soon...</div>;
    }
};