import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown, X, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  user_name: string;
  email: string;
  college_name: string;
  correct_answers: number;
  total_questions: number;
  score_percentage: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
}

const LeaderboardModal = ({ isOpen, onClose, currentUserEmail }: LeaderboardModalProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard whenever modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  // Set up auto-refresh every 5 seconds when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      fetchLeaderboard(false); // Fetch without showing loading spinner
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchLeaderboard = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const { data, error } = await supabase.rpc('get_top_leaderboard', {
        limit_count: 10,
      });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const getBadgeIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg" />;
      case 2:
        return <Medal className="w-10 h-10 text-gray-300 drop-shadow-lg" />;
      case 3:
        return <Award className="w-10 h-10 text-amber-600 drop-shadow-lg" />;
      default:
        return null;
    }
  };

  const getBadgeGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 3:
        return 'from-amber-500 via-amber-600 to-amber-700';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getBadgeGlow = (rank: number) => {
    switch (rank) {
      case 1:
        return 'shadow-yellow-500/50';
      case 2:
        return 'shadow-gray-400/50';
      case 3:
        return 'shadow-amber-500/50';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
        style={{ animation: 'slideUpFade 0.4s ease-out' }}
      >
        {/* Sparkle Border Container */}
        <div className="sparkle-border-container">
          {/* Sparkle Effects */}
          <div className="sparkle-effect sparkle-1"></div>
          <div className="sparkle-effect sparkle-2"></div>
          <div className="sparkle-effect sparkle-3"></div>
          <div className="sparkle-effect sparkle-4"></div>
          
          {/* Main Content - Dark Mode */}
          <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Refresh Button */}
            <button
              onClick={() => fetchLeaderboard()}
              className="absolute top-4 right-16 z-20 w-10 h-10 flex items-center justify-center bg-emerald-500/20 hover:bg-emerald-500/40 rounded-full shadow-lg shadow-emerald-500/50 transition-all duration-200 hover:scale-110 hover:rotate-180 group border border-emerald-500/50"
              title="Refresh leaderboard"
            >
              <RefreshCw className="w-5 h-5 text-emerald-300 transition-all duration-300" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/40 rounded-full shadow-lg shadow-cyan-500/50 transition-all duration-200 hover:scale-110 group border border-cyan-500/50"
            >
              <X className="w-5 h-5 text-cyan-300 group-hover:text-red-400 transition-colors" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-8 py-6 relative overflow-hidden border-b-2 border-cyan-400/30">
              {/* Animated background sparkles */}
              <div className="absolute inset-0 opacity-30">
                <Sparkles className="absolute top-4 left-10 w-6 h-6 text-cyan-200 animate-pulse" style={{ animationDelay: '0s' }} />
                <Sparkles className="absolute top-10 right-20 w-4 h-4 text-purple-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Sparkles className="absolute bottom-6 left-1/3 w-5 h-5 text-blue-200 animate-pulse" style={{ animationDelay: '1s' }} />
                <Sparkles className="absolute bottom-4 right-10 w-6 h-6 text-cyan-200 animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-400/30 backdrop-blur-sm rounded-full mb-3 shadow-xl shadow-cyan-500/50 border-2 border-cyan-400/50">
                  <Trophy className="w-8 h-8 text-cyan-200 drop-shadow-lg" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-1 drop-shadow-lg">
                  Leaderboard
                </h2>
                <p className="text-cyan-100 text-base drop-shadow">
                  🏆 Top Performers • Hall of Fame 🏆
                </p>
              </div>
            </div>

            {/* Leaderboard Content */}
            <div className="overflow-y-auto dark-scrollbar" style={{ maxHeight: '420px' }}>
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
                  <p className="mt-4 text-cyan-300">Loading champions...</p>
                </div>
              ) : (
                <div className="p-6">
                  <table className="w-full border-collapse rounded-lg overflow-hidden neon-table">
                    {/* Table Header */}
                    <thead className="sticky top-0 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 z-10">
                      <tr>
                        <th className="py-3 px-4 text-center text-cyan-200 font-bold text-sm border border-cyan-500/50 shadow-inner">Rank</th>
                        <th className="py-3 px-4 text-left text-cyan-200 font-bold text-sm border border-cyan-500/50 shadow-inner">Name</th>
                        <th className="py-3 px-4 text-left text-cyan-200 font-bold text-sm border border-cyan-500/50 shadow-inner">Email</th>
                        <th className="py-3 px-4 text-left text-cyan-200 font-bold text-sm border border-cyan-500/50 shadow-inner">College</th>
                        <th className="py-3 px-4 text-center text-cyan-200 font-bold text-sm border border-cyan-500/50 shadow-inner">Score</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {entries.map((entry, index) => {
                        const isCurrentUser = entry.email === currentUserEmail;
                        const isTopThree = entry.rank <= 3;

                        return (
                          <tr
                            key={index}
                            className={`transition-all duration-300 neon-row ${
                              isCurrentUser 
                                ? 'bg-gradient-to-r from-emerald-900/40 to-green-900/40 border-emerald-400/60' 
                                : isTopThree
                                ? 'bg-gradient-to-r from-purple-900/20 via-gray-900/40 to-blue-900/20'
                                : 'bg-gray-900/30 hover:bg-cyan-900/20'
                            }`}
                            style={{
                              animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
                            }}
                          >
                            {/* Rank Column with Badge */}
                            <td className="py-3 px-4 text-center relative border border-cyan-500/30">
                              {isTopThree ? (
                                <div className="relative badge-container inline-block">
                                  {/* Hanging String */}
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-1 h-6 bg-gradient-to-b from-gray-400 to-transparent hanging-string"></div>
                                  
                                  {/* Badge */}
                                  <div
                                    className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${getBadgeGradient(
                                      entry.rank
                                    )} flex items-center justify-center shadow-2xl ${getBadgeGlow(entry.rank)} hanging-badge badge-swing-${entry.rank}`}
                                  >
                                    {/* Inner glow ring */}
                                    <div className="absolute inset-1 rounded-full bg-white/20 animate-pulse"></div>
                                    
                                    {/* Badge icon */}
                                    <div className="relative z-10">
                                      {getBadgeIcon(entry.rank)}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center font-bold text-cyan-200 shadow-lg shadow-cyan-500/30 border-2 border-cyan-500/50 mx-auto">
                                  {entry.rank}
                                </div>
                              )}
                            </td>

                            {/* Name Column */}
                            <td className="py-3 px-4 border border-cyan-500/30">
                              <p className="font-bold text-white truncate text-base">
                                {entry.user_name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-semibold shadow-lg shadow-emerald-500/50">
                                    You
                                  </span>
                                )}
                              </p>
                            </td>

                            {/* Email Column */}
                            <td className="py-3 px-4 border border-cyan-500/30">
                              <p className="text-gray-300 text-sm truncate">{entry.email}</p>
                            </td>

                            {/* College Column */}
                            <td className="py-3 px-4 border border-cyan-500/30">
                              <p className="text-gray-300 text-sm truncate">{entry.college_name}</p>
                            </td>

                            {/* Score Column */}
                            <td className="py-3 px-4 text-center border border-cyan-500/30">
                              <div className="inline-flex flex-col bg-gradient-to-br from-cyan-900/50 to-blue-900/50 px-3 py-1.5 rounded-lg border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                                <span className="text-lg font-bold text-cyan-100">
                                  {entry.correct_answers} / {entry.total_questions}
                                </span>
                                <span className="text-xs text-cyan-300 font-semibold">
                                  {entry.score_percentage.toFixed(0)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty State */}
              {entries.length === 0 && !loading && (
                <div className="py-16 text-center">
                  <Trophy className="w-20 h-20 mx-auto mb-4 text-cyan-500/50" />
                  <p className="text-cyan-300 text-lg">No entries yet!</p>
                  <p className="text-cyan-400/70 text-sm mt-2">Be the first to complete the quiz</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Modal Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Neon Glow Border Animation */
        .sparkle-border-container {
          position: relative;
          padding: 4px;
          border-radius: 1.5rem;
          background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4);
          background-size: 300% 300%;
          animation: neonGlow 6s ease infinite;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(59, 130, 246, 0.3);
        }

        @keyframes neonGlow {
          0%, 100% { 
            background-position: 0% 50%;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(59, 130, 246, 0.4);
          }
          50% { 
            background-position: 100% 50%;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 50px rgba(6, 182, 212, 0.4);
          }
        }

        /* Sparkle Effects */
        .sparkle-effect {
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          box-shadow: 0 0 12px 4px rgba(255, 255, 255, 0.8);
          animation: sparkleMove 4s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 10%;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: 30%;
          animation-delay: 1s;
        }

        .sparkle-3 {
          top: 60%;
          animation-delay: 2s;
        }

        .sparkle-4 {
          top: 85%;
          animation-delay: 3s;
        }

        @keyframes sparkleMove {
          0% {
            left: -10px;
            opacity: 0;
            transform: scale(0);
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            left: calc(100% + 10px);
            opacity: 0;
            transform: scale(0);
          }
        }

        /* Hanging Badge Animations */
        .hanging-string {
          animation: stringSwing 3s ease-in-out infinite;
          transform-origin: top center;
        }

        .hanging-badge {
          transform-origin: top center;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
        }

        .badge-swing-1 {
          animation: badgeSwing1 3s ease-in-out infinite;
        }

        .badge-swing-2 {
          animation: badgeSwing2 3.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .badge-swing-3 {
          animation: badgeSwing3 4s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        @keyframes stringSwing {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(2px) rotate(2deg); }
          75% { transform: translateX(-2px) rotate(-2deg); }
        }

        @keyframes badgeSwing1 {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg); }
        }

        @keyframes badgeSwing2 {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(4deg); }
          60% { transform: rotate(-4deg); }
        }

        @keyframes badgeSwing3 {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(-6deg); }
          66% { transform: rotate(6deg); }
        }

        /* Shimmer Overlay */
        .shimmer-overlay {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Dark Scrollbar */
        .dark-scrollbar::-webkit-scrollbar {
          width: 10px;
        }

        .dark-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.8);
          border-radius: 10px;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .dark-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 1px solid rgba(6, 182, 212, 0.4);
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .dark-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb, #7c3aed);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
        }

        /* Neon Table Effects */
        .neon-table {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
        }

        .neon-row {
          transition: all 0.3s ease;
          position: relative;
        }

        .neon-row:hover {
          background: rgba(6, 182, 212, 0.15) !important;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.3), inset 0 0 15px rgba(6, 182, 212, 0.1);
          transform: scale(1.01);
        }

        .neon-row:hover td {
          border-color: rgba(6, 182, 212, 0.6) !important;
        }

        /* Prevent body scroll when modal is open */
        .modal-backdrop {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardModal;
