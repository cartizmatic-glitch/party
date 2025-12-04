
import { GameMeta, Player } from './types';
import { 
  Gamepad2, Brain, Calculator, Zap, Grid3X3, MousePointer2, 
  HelpCircle, Activity, Palette, Wind, X, Hand, Keyboard, Search, HelpCircle as Question,
  Globe2, MapPin, Flag, Gift, Trophy, Map, Car, Swords, Users, Crosshair, Crown
} from 'lucide-react';

export const CHARACTERS: Player[] = [
  { id: 'c1', name: 'Cyber Fox', avatar: '🦊', color: 'from-orange-400 to-red-600' },
  { id: 'c2', name: 'Neon Cat', avatar: '🐱', color: 'from-pink-400 to-purple-600' },
  { id: 'c3', name: 'Space Dog', avatar: '🐶', color: 'from-blue-400 to-cyan-600' },
  { id: 'c4', name: 'Robo Bear', avatar: '🐻', color: 'from-emerald-400 to-teal-600' },
  { id: 'c5', name: 'Dragon King', avatar: '🐲', color: 'from-red-500 to-orange-500' },
  { id: 'c6', name: 'Ninja Panda', avatar: '🐼', color: 'from-slate-600 to-black' },
  { id: 'c7', name: 'Magic Unicorn', avatar: '🦄', color: 'from-violet-400 to-fuchsia-600' },
  { id: 'c8', name: 'Cool Tiger', avatar: '🐯', color: 'from-amber-400 to-orange-700' },
];

export const GAMES_LIST: GameMeta[] = [
  // Multiplayer Games
  { 
    id: 'duel', 
    name: 'Wild Duel', 
    description: 'دوئل دو نفره', 
    image: 'https://images.unsplash.com/photo-1615555776102-1432cc1f021e?q=80&w=400&auto=format&fit=crop', // Western/Desert
    icon: Crosshair, 
    color: 'text-rose-500', 
    bgColor: 'bg-rose-900/50',
    difficulty: '2-Player'
  },
  { 
    id: 'sumo', 
    name: 'Finger Sumo', 
    description: 'زورآزمایی دو نفره', 
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=400&auto=format&fit=crop', // Fight
    icon: Users, 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-900/50',
    difficulty: '2-Player'
  },
  { 
    id: 'tap_war', 
    name: 'Tap War 4P', 
    description: 'نبرد ۴ نفره', 
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop', // Gaming setup
    icon: Crown, 
    color: 'text-yellow-500', 
    bgColor: 'bg-yellow-900/50',
    difficulty: '4-Player'
  },
  // Single Player - Action
  { 
    id: 'soccer', 
    name: 'Soccer Pro', 
    description: 'فوتبال هیجانی', 
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop', // Football
    icon: Trophy, 
    color: 'text-green-500', 
    bgColor: 'bg-green-900/50',
    difficulty: 'Medium'
  },
  { 
    id: 'racer', 
    name: 'Turbo Racer', 
    description: 'ماشین بازی', 
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400&auto=format&fit=crop', // Car
    icon: Car, 
    color: 'text-red-500', 
    bgColor: 'bg-red-900/50',
    difficulty: 'Hard'
  },
  { 
    id: 'ninja', 
    name: 'Ninja Blade', 
    description: 'برش سرعتی', 
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400&auto=format&fit=crop', // Sword
    icon: Swords, 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-900/50',
    difficulty: 'Hard'
  },
  // Iranian & Local
  { 
    id: 'gol_pooch', 
    name: 'Gol Ya Pooch', 
    description: 'بازی سنتی ایرانی', 
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400&auto=format&fit=crop', // Hands
    icon: Hand, 
    color: 'text-amber-300', 
    bgColor: 'bg-amber-900/50',
    difficulty: 'Easy'
  },
  { 
    id: 'yalda', 
    name: 'Yalda Catch', 
    description: 'انار چینی یلدا', 
    image: 'https://images.unsplash.com/photo-1543093256-4299b8d2cb38?q=80&w=400&auto=format&fit=crop', // Fruit
    icon: Gift, 
    color: 'text-red-500', 
    bgColor: 'bg-red-900/50',
    difficulty: 'Medium'
  },
  // Puzzle & Logic
  { 
    id: 'maze', 
    name: 'Labyrinth', 
    description: 'مسیر یاب', 
    image: 'https://images.unsplash.com/photo-1634153796582-7f2409745772?q=80&w=400&auto=format&fit=crop', // Abstract maze
    icon: Map, 
    color: 'text-amber-500', 
    bgColor: 'bg-amber-900/50',
    difficulty: 'Medium'
  },
  { 
    id: 'memory', 
    name: 'Memory', 
    description: 'کارت‌های مشابه', 
    image: 'https://images.unsplash.com/photo-1623933758362-e616c6d05f3d?q=80&w=400&auto=format&fit=crop', // Cards
    icon: Grid3X3, 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-900/50',
    difficulty: 'Medium'
  },
  { 
    id: 'simon', 
    name: 'Echo', 
    description: 'تکرار الگو', 
    image: 'https://images.unsplash.com/photo-1555616635-640960031520?q=80&w=400&auto=format&fit=crop', // Neon lights
    icon: Activity, 
    color: 'text-cyan-400', 
    bgColor: 'bg-cyan-900/50',
    difficulty: 'Medium'
  },
  // Geography
  { 
    id: 'flags', 
    name: 'Flag Quiz', 
    description: 'حدس پرچم', 
    image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=400&auto=format&fit=crop', // Flags
    icon: Flag, 
    color: 'text-blue-300', 
    bgColor: 'bg-blue-900/50',
    difficulty: 'Medium'
  },
  { 
    id: 'capitals', 
    name: 'Capitals', 
    description: 'پایتخت شناسی', 
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop', // Globe/Map
    icon: Globe2, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-900/50',
    difficulty: 'Hard'
  },
  // Classic Arcade
  { 
    id: 'snake', 
    name: 'Neon Snake', 
    description: 'بازی کلاسیک مار', 
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400&auto=format&fit=crop', // Green neon
    icon: Gamepad2, 
    color: 'text-green-400', 
    bgColor: 'bg-green-900/50',
    difficulty: 'Medium'
  },
  { 
    id: 'whack', 
    name: 'Emoji Pop', 
    description: 'شکار ایموجی', 
    image: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?q=80&w=400&auto=format&fit=crop', // Party/Fun
    icon: MousePointer2, 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-900/50',
    difficulty: 'Easy'
  },
  // Brain & Skills
  { 
    id: 'math', 
    name: 'Math Sprint', 
    description: 'ریاضی سریع', 
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&auto=format&fit=crop', // Math
    icon: Calculator, 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-900/50',
    difficulty: 'Hard'
  },
  { 
    id: 'trivia', 
    name: 'AI Trivia', 
    description: 'سوالات هوشمند', 
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=400&auto=format&fit=crop', // Brain/Quiz
    icon: HelpCircle, 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-900/50',
    difficulty: 'Hard'
  },
  { 
    id: 'reflex', 
    name: 'Reflex', 
    description: 'سرعت واکنش', 
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop', // Lightning/Speed
    icon: Zap, 
    color: 'text-red-400', 
    bgColor: 'bg-red-900/50',
    difficulty: 'Hard'
  },
  { 
    id: 'color_match', 
    name: 'Chroma', 
    description: 'تطبیق رنگ', 
    image: 'https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?q=80&w=400&auto=format&fit=crop', // Colors
    icon: Palette, 
    color: 'text-pink-400', 
    bgColor: 'bg-pink-900/50',
    difficulty: 'Medium'
  },
  { 
    id: 'clicker', 
    name: 'Speed Tap', 
    description: 'کلیک سرعتی', 
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', // Cyberpunk
    icon: MousePointer2, 
    color: 'text-lime-400', 
    bgColor: 'bg-lime-900/50',
    difficulty: 'Easy'
  },
  { 
    id: 'breathing', 
    name: 'Zen', 
    description: 'تمرکز و تنفس', 
    image: 'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=400&auto=format&fit=crop', // Zen stone
    icon: Wind, 
    color: 'text-teal-400', 
    bgColor: 'bg-teal-900/50',
    difficulty: 'Easy'
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'دوز کلاسیک',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop', // Grid
    icon: X,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900/50',
    difficulty: 'Medium'
  },
  {
    id: 'rps',
    name: 'R.P.S',
    description: 'سنگ کاغذ قیچی',
    image: 'https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=400&auto=format&fit=crop', // Hands
    icon: Hand,
    color: 'text-rose-400',
    bgColor: 'bg-rose-900/50',
    difficulty: 'Easy'
  },
  {
    id: 'typing',
    name: 'Typing',
    description: 'تایپ کلمات',
    image: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=400&auto=format&fit=crop', // Keyboard
    icon: Keyboard,
    color: 'text-sky-400',
    bgColor: 'bg-sky-900/50',
    difficulty: 'Hard'
  },
  {
    id: 'guess',
    name: 'Guess #',
    description: 'حدس عدد',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop', // Dice
    icon: Question,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/50',
    difficulty: 'Medium'
  },
  {
    id: 'odd_one',
    name: 'Odd One',
    description: 'پیدا کردن تفاوت',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&auto=format&fit=crop', // Abstract
    icon: Search,
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-900/50',
    difficulty: 'Easy'
  }
];
