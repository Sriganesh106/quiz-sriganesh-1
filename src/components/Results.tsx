import { Trophy, Clock, Target, RotateCcw } from 'lucide-react';

interface ResultsProps {
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  onRestart: () => void;
  userEmail?: string;
}

export default function Results({
  correctAnswers,
  totalQuestions,
  timeTaken,
  onRestart,
  userEmail,
}: ResultsProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-emerald-600' };
    if (percentage >= 70) return { text: 'Great Job!', color: 'text-blue-600' };
    if (percentage >= 50) return { text: 'Good Effort!', color: 'text-yellow-600' };
    return { text: 'Keep Practicing!', color: 'text-orange-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full transform transition-all"
        style={{
          animation: 'slideUp 0.5s ease-out',
        }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 break-words">Quiz Complete!</h1>
          <p className={`text-xl sm:text-2xl font-semibold ${performance.color} break-words`}>
            {performance.text}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 sm:p-6 border-2 border-emerald-200">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mb-3 mx-auto">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700 break-words">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-xs sm:text-sm text-emerald-600 font-medium mt-1 break-words">
                Correct Answers
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 sm:p-6 border-2 border-blue-200">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-3 mx-auto">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-700 break-words">{percentage}%</div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium mt-1 break-words">
                Accuracy
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border-2 border-purple-200">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-3 mx-auto">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-700 break-words">
                {formatTime(timeTaken)}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 font-medium mt-1 break-words">
                Time Taken
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              You answered <span className="font-semibold text-emerald-600">{correctAnswers}</span>{' '}
              out of <span className="font-semibold">{totalQuestions}</span> questions correctly
            </p>
            <p className="text-xs text-gray-500">
              Standard Round: 8 questions • Final Boss Round: 7 questions
            </p>
            <p className="mt-4 text-sm text-gray-500">
              💡 Click the <span className="font-semibold text-emerald-600">Leaderboard</span> button above to see rankings!
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
