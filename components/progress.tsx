// components/progress.tsx

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, TrendingUp, Target, Award, Calendar, 
  BarChart3, Brain, Zap, BookOpen, Clock, CheckCircle, 
  XCircle, SkipForward, Activity
} from "lucide-react"
import { useSession } from "next-auth/react"

interface DayActivity {
  date: string;
  count: number;
  correct: number;
  incorrect: number;
  skipped: number;
}

interface ProgressStats {
  mathElo: number;
  physicsElo: number;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  mathQuestions: number;
  physicsQuestions: number;
  accuracyRate: number;
  currentStreak: number;
  longestStreak: number;
  mostActiveDay: string;
  recentActivity: DayActivity[];
  categoryBreakdown: { category: string; count: number; accuracy: number }[];
}

interface ProgressProps {
  onBack: () => void;
}

export default function Progress({ onBack }: ProgressProps) {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProgressData();
    } else {
      setLoading(false);
    }
  }, [status, selectedMonth]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch(`/api/progress/detailed?month=${selectedMonth.toISOString()}`);
      const data = await response.json();
      if (!data.error) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar grid for the selected month
  const generateCalendarGrid = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const grid: (DayActivity | null)[] = [];
    
    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      grid.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const activity = stats?.recentActivity?.find(a => a.date === dateStr) || {
        date: dateStr,
        count: 0,
        correct: 0,
        incorrect: 0,
        skipped: 0
      };
      grid.push(activity);
    }
    
    return grid;
  };

  const getActivityColor = (count: number) => {
    if (count === 0) return 'bg-muted/20';
    if (count <= 5) return 'bg-green-500/30';
    if (count <= 10) return 'bg-green-500/50';
    if (count <= 20) return 'bg-green-500/70';
    return 'bg-green-500/90';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
        <div className="relative z-10 glass rounded-2xl p-8 text-center">
          <Activity className="w-16 h-16 text-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
        <div className="relative z-10 glass rounded-2xl p-8 text-center max-w-md">
          <BarChart3 className="w-16 h-16 text-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Sign In to Track Progress</h2>
          <p className="text-muted-foreground mb-6">Create an account to save your progress, track your ELO ratings, and see detailed statistics.</p>
          <button onClick={onBack} className="glass px-6 py-3 rounded-lg text-foreground hover:bg-card/90">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const calendarGrid = generateCalendarGrid();
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat dynamic-background" />
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex items-center justify-between mb-6"
        >
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors glass px-3 py-2 rounded-lg"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>
          <div className="glass px-4 py-2 rounded-lg">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 size={24} />
              Your Progress
            </h1>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ELO Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Math ELO</h3>
              <Brain className="text-cyan-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.mathElo || 1200}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {stats?.mathQuestions || 0} questions attempted
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Physics ELO</h3>
              <Zap className="text-purple-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats?.physicsElo || 1200}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {stats?.physicsQuestions || 0} questions attempted
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Accuracy</h3>
              <Target className="text-green-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stats?.accuracyRate ? `${Math.round(stats.accuracyRate)}%` : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {stats?.totalCorrect || 0} correct out of {stats?.totalQuestions || 0}
            </p>
          </motion.div>
        </div>

        {/* Activity Calendar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calendar size={24} />
              Activity Calendar
            </h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                className="text-muted-foreground hover:text-foreground"
              >
                ←
              </button>
              <span className="text-foreground font-medium">
                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </span>
              <button 
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                className="text-muted-foreground hover:text-foreground"
                disabled={selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear()}
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 relative">
            {calendarGrid.map((day, index) => (
              <div
                key={index}
                className="aspect-square relative"
                onMouseEnter={() => day && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {day ? (
                  <div 
                    className={`w-full h-full rounded-md flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:ring-2 hover:ring-foreground/50 ${getActivityColor(day.count)}`}
                  >
                    {parseInt(day.date.split('-')[2])}
                  </div>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>

          {hoveredDay && (
            <div className="mt-4 p-3 bg-card/80 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">{formatDate(hoveredDay.date)}</p>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <span className="ml-2 font-medium text-foreground">{hoveredDay.count}</span>
                </div>
                <div>
                  <span className="text-green-500">Correct:</span>
                  <span className="ml-2 font-medium text-foreground">{hoveredDay.correct}</span>
                </div>
                <div>
                  <span className="text-red-500">Incorrect:</span>
                  <span className="ml-2 font-medium text-foreground">{hoveredDay.incorrect}</span>
                </div>
                <div>
                  <span className="text-yellow-500">Skipped:</span>
                  <span className="ml-2 font-medium text-foreground">{hoveredDay.skipped}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 mt-6">
            <span className="text-sm text-muted-foreground">Less</span>
            <div className="flex items-center gap-2">
              {[0, 5, 10, 20, 30].map((count, i) => (
                <div key={i} className={`w-4 h-4 rounded ${getActivityColor(count)}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">More</span>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="text-blue-400" size={20} />
              <span className="text-sm text-muted-foreground">Total Questions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.totalQuestions || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-yellow-400" size={20} />
              <span className="text-sm text-muted-foreground">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.currentStreak || 0} days</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-sm text-muted-foreground">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.longestStreak || 0} days</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-purple-400" size={20} />
              <span className="text-sm text-muted-foreground">Most Active Day</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {stats?.mostActiveDay ? formatDate(stats.mostActiveDay) : 'N/A'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}