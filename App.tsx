import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronLeft, Volume2, VolumeX, User, Gamepad, Star, Lock, Play, ArrowRight } from 'lucide-react';
import { CHARACTERS, GAMES_LIST } from './constants';
import { GameLoader } from './components/Games';
import { Player, GameRecord, GameId } from './types';
import { sfx } from './utils/audio';

export default function App() {
  const [screen, setScreen] = useState<'char_select' | 'menu' | 'game' | 'result'>('char_select');
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('arcade_records');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  // Handle music logic
  useEffect(() => {
      sfx.toggleMute(!soundEnabled);
      
      // Stop any existing music first to prevent overlaps
      sfx.stopMusic();

      // Only play music in the main menu
      if (soundEnabled && screen === 'menu') {
          // Small delay to ensure user interaction (Chrome policy) if coming from start
          setTimeout(() => sfx.playBgMusicStart(), 100);
      }
      
      return () => {
          sfx.stopMusic();
      };
  }, [screen, soundEnabled]);

  const saveRecord = (gameId: string, score: number) => {
    setRecords(prev => {
      const existing = prev.find(r => r.gameId === gameId);
      if (!existing || score > existing.score) {
        const newRecs = prev.filter(r => r.gameId !== gameId);
        newRecs.push({ gameId, score, date: Date.now() });
        localStorage.setItem('arcade_records', JSON.stringify(newRecs));
        return newRecs;
      }
      return prev;
    });
  };

  const handleCharSelect = (char: Player) => {
    setPlayer(char);
    sfx.playClick();
    setScreen('menu');
  };

  const handleGameSelect = (id: GameId) => {
    if (id === 'locked') return;
    setSelectedGame(id);
    sfx.playClick();
    setScreen('game');
  };

  const handleGameOver = (score: number) => {
    setCurrentScore(score);
    if (selectedGame) saveRecord(selectedGame, score);
    sfx.playWin();
    setScreen('result');
  };

  const renderCharacterSelect = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-4 min-h-screen flex flex-col justify-center py-12"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
          ARCADE VERSE
        </h1>
        <p className="text-gray-300 text-sm md:text-xl font-medium bg-white/5 inline-block px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
          انتخاب کاراکتر
        </p>
      </div>
      
      {/* Mobile: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-4 w-full">
        {CHARACTERS.map(char => (
          <motion.button
            key={char.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCharSelect(char)}
            className={`relative p-4 md:p-6 rounded-2xl bg-gradient-to-br ${char.color} shadow-xl flex flex-col items-center justify-center group overflow-hidden border-2 border-white/10 aspect-square`}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            
            <div className="text-5xl md:text-7xl mb-3 z-10 drop-shadow-xl transform group-hover:scale-110 transition-transform">{char.avatar}</div>
            <div className="text-sm md:text-lg font-black z-10 text-white w-full text-center drop-shadow-md">{char.name}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderMenu = () => (
    <div className="max-w-7xl mx-auto min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${player?.color} flex items-center justify-center text-lg md:text-xl border border-white/20 shadow-lg`}>
                  {player?.avatar}
              </div>
              <div className="flex flex-col">
                  <span className="font-bold text-xs md:text-sm text-white max-w-[80px] truncate">{player?.name}</span>
                  <button onClick={() => setScreen('char_select')} className="text-[10px] text-gray-400 text-right hover:text-white transition-colors">تغییر</button>
              </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="bg-gray-800/80 rounded-lg px-2 py-1.5 flex items-center gap-1.5 border border-white/10">
                    <Trophy className="text-yellow-400 w-3.5 h-3.5" />
                    <span className="font-mono font-bold text-xs md:text-sm text-white">
                        {records.reduce((a,b) => a + b.score, 0).toLocaleString()}
                    </span>
                </div>
                <button 
                    onClick={() => setSoundEnabled(!soundEnabled)} 
                    className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-gray-800 rounded-lg border border-white/10 text-gray-300"
                >
                    {soundEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
                </button>
            </div>
        </div>
      </header>

      <div className="p-4 pb-24 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
              <Gamepad className="text-indigo-400 w-5 h-5" />
              <h2 className="text-xl font-black text-white">بازی‌ها</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
            {GAMES_LIST.map((game, idx) => {
                const isLocked = game.id === 'locked';
                const highScore = records.find(r => r.gameId === game.id)?.score;

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => handleGameSelect(game.id)}
                        className={`group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border-2 border-gray-800 bg-gray-900 shadow-xl
                            ${isLocked ? 'grayscale opacity-60' : 'active:scale-95 transition-transform'}`}
                    >
                        {/* Background Image with Overlay */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${game.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent opacity-90" />

                        {highScore !== undefined && (
                            <div className="absolute top-2 right-2 bg-yellow-400/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm z-20">
                                <Star size={8} fill="black" /> {highScore}
                            </div>
                        )}

                        <div className="absolute inset-0 p-3 flex flex-col justify-end items-center text-center z-10">
                            <div className={`p-2 rounded-xl mb-2 ${game.bgColor} backdrop-blur-md border border-white/10 shadow-lg`}>
                                {isLocked ? <Lock size={16} className="text-gray-400" /> : <game.icon size={20} className={game.color} />}
                            </div>
                            
                            <h3 className="font-black text-sm text-white leading-tight mb-1 drop-shadow-md">
                                {game.name}
                            </h3>
                            
                            <div className="flex items-center gap-1 opacity-90">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    game.difficulty === 'Easy' ? 'bg-green-400' : 
                                    game.difficulty === 'Medium' ? 'bg-yellow-400' : 
                                    game.difficulty.includes('Player') ? 'bg-blue-400' : 'bg-red-400'
                                }`} />
                                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-300">{game.difficulty}</span>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
          </div>
      </div>
    </div>
  );

  const renderGame = () => {
      const meta = GAMES_LIST.find(g => g.id === selectedGame);
      return (
        <div className="min-h-screen flex flex-col bg-gray-950">
            <div className="px-4 py-3 bg-[#0f172a] border-b border-white/10 flex items-center justify-between shadow-lg z-50 sticky top-0">
                <button 
                    onClick={() => setScreen('menu')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                >
                    <ArrowRight size={16} /> <span className="text-xs font-bold">خروج</span>
                </button>
                <h2 className="font-black text-sm text-white tracking-wide truncate max-w-[150px]">
                    {meta?.name}
                </h2>
                <div className="w-16 flex justify-end">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl scale-125"
                    style={{ backgroundImage: `url(${meta?.image})` }}
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 w-full max-w-lg bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl min-h-[400px] flex flex-col justify-center items-center"
                >
                    {selectedGame && <GameLoader gameId={selectedGame} onGameOver={handleGameOver} />}
                </motion.div>
            </div>
        </div>
      );
  }

  const renderResult = () => {
      const meta = GAMES_LIST.find(g => g.id === selectedGame);
      const isBest = (records.find(r => r.gameId === selectedGame)?.score || 0) <= currentScore;

      return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#0f172a] relative overflow-hidden"
          >
              <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 blur-md"
                  style={{ backgroundImage: `url(${meta?.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent" />
              
              <div className="relative z-10 max-w-sm w-full flex flex-col items-center">
                <motion.div 
                    initial={{ y: -50, rotate: -10 }} 
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="text-8xl mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                    {isBest ? '🏆' : '💀'}
                </motion.div>
                
                <h2 className="text-4xl font-black mb-2 text-white tracking-tighter drop-shadow-lg">
                    {isBest ? 'رکورد جدید!' : 'پایان بازی'}
                </h2>
                <p className="text-indigo-300 text-lg font-bold mb-8">{meta?.name}</p>
                
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full mb-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-[0.2em] font-bold">امتیاز نهایی</div>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 font-mono">
                        {currentScore}
                    </div>
                </div>

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={() => setScreen('menu')}
                        className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold transition-all border border-white/10 text-white flex items-center justify-center gap-2"
                    >
                        <ChevronLeft size={18} /> منو
                    </button>
                    <button 
                        onClick={() => handleGameSelect(selectedGame!)}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold shadow-lg text-white flex items-center justify-center gap-2"
                    >
                        تکرار <Play size={18} fill="currentColor" />
                    </button>
                </div>
              </div>
          </motion.div>
      )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden" dir="rtl">
      <AnimatePresence mode="wait">
        <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
        >
            {screen === 'char_select' && renderCharacterSelect()}
            {screen === 'menu' && renderMenu()}
            {screen === 'game' && renderGame()}
            {screen === 'result' && renderResult()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
