import { Trophy, Sparkles } from 'lucide-react';

interface LeaderboardButtonProps {
  onClick: () => void;
}

const LeaderboardButton = ({ onClick }: LeaderboardButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="leaderboard-button group"
    >
      {/* Container to contain glow */}
      <div className="relative glow-container">
        {/* Glowing background - contained within button */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        
        {/* Button content */}
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 px-6 py-3 rounded-2xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        {/* Icon container */}
        <div className="relative">
          <Trophy className="w-6 h-6 text-white drop-shadow-lg" />
          {/* Sparkle effect on icon */}
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        </div>
        
        {/* Text */}
        <span className="text-white font-bold text-lg drop-shadow-md">
          Leaderboard
        </span>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 rounded-2xl shine-effect"></div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="floating-particle particle-1"></div>
      <div className="floating-particle particle-2"></div>
      <div className="floating-particle particle-3"></div>

      <style>{`
        .leaderboard-button {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 40;
          cursor: pointer;
          border: none;
          background: transparent;
        }
        
        /* Container to contain the glow within button bounds */
        .glow-container {
          display: inline-block;
          overflow: hidden;
          border-radius: 1rem;
          padding: 4px;
        }

        /* Shine effect */
        .shine-effect {
          background: linear-gradient(
            120deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 60%,
            transparent 100%
          );
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* Floating particles */
        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.8);
        }

        .particle-1 {
          top: 20%;
          left: 10%;
          animation: floatParticle 4s ease-in-out infinite;
          animation-delay: 0s;
        }

        .particle-2 {
          top: 50%;
          right: 15%;
          animation: floatParticle 5s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .particle-3 {
          bottom: 25%;
          left: 25%;
          animation: floatParticle 4.5s ease-in-out infinite;
          animation-delay: 3s;
        }

        @keyframes floatParticle {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          10% {
            opacity: 1;
            transform: translateY(-5px) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0);
          }
        }

        /* Responsive positioning */
        @media (max-width: 768px) {
          .leaderboard-button {
            top: 10px;
            right: 10px;
          }
          
          .leaderboard-button .relative {
            padding: 0.625rem 1rem;
          }
          
          .leaderboard-button span {
            font-size: 1rem;
          }
        }

        /* Button press effect */
        .leaderboard-button:active .relative {
          transform: scale(0.95);
        }
      `}</style>
    </button>
  );
};

export default LeaderboardButton;
