import { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import Countdown from './components/Countdown';
import BossTransition from './components/BossTransition';
import ProgressLine from './components/ProgressLine';
import QuestionCard, { QuizQuestion } from './components/QuestionCard';
import Timer from './components/Timer';
import Results from './components/Results';
import UserDetailsForm from './components/UserDetailsForm';
import LeaderboardButton from './components/LeaderboardButton';
import LeaderboardModal from './components/LeaderboardModal';
import { supabase } from './lib/supabase';

type QuizState = 'user-details' | 'welcome' | 'countdown' | 'quiz' | 'boss-transition' | 'results';

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  college: string;
}

interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

function App() {
  const [quizState, setQuizState] = useState<QuizState>('user-details');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentPhase =
    currentQuestion?.difficulty === 'boss' ? 'boss' : 'standard';

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_number', { ascending: true });

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        throw new Error('No questions found');
      }

      setQuestions(data as QuizQuestion[]);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleUserDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    setQuizState('welcome');
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      loadQuestions();
    }
    setQuizState('countdown');
  };

  const handleCountdownComplete = () => {
    setQuizState('quiz');
  };

  const handleAnswer = (userAnswer: string) => {
    if (!currentQuestion) return;

    const isBossRound = currentQuestion.difficulty === 'boss';
    const isCorrect = isBossRound
      ? userAnswer !== currentQuestion.correct_answer
      : userAnswer === currentQuestion.correct_answer;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);

    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1];
      const isEnteringBossRound =
        currentQuestion.difficulty === 'standard' &&
        nextQuestion?.difficulty === 'boss';

      if (isEnteringBossRound) {
        setTimeout(() => {
          setQuizState('boss-transition');
        }, 500);
      } else {
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 500);
      }
    } else {
      setTimeout(() => {
        finishQuiz([...answers, newAnswer]);
      }, 500);
    }
  };

  const handleBossTransitionComplete = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setQuizState('quiz');
  };


  const finishQuiz = async (finalAnswers: QuizAnswer[]) => {
    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;

    try {
      if (userDetails) {
        // Use the RPC function to save results with user details
        await supabase.rpc('submit_quiz_with_details', {
          p_user_name: userDetails.name,
          p_email: userDetails.email,
          p_mobile_number: userDetails.mobile,
          p_college_name: userDetails.college,
          p_total_questions: questions.length,
          p_correct_answers: correctCount,
          p_time_taken_seconds: timeTaken,
          p_answers: finalAnswers,
        });
      } else {
        // Fallback to direct insert if no user details
        await supabase.from('quiz_results').insert({
          total_questions: questions.length,
          correct_answers: correctCount,
          time_taken_seconds: timeTaken,
          answers: finalAnswers,
        });
      }
    } catch (err) {
      console.error('Error saving quiz results:', err);
    }

    setQuizState('results');
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeTaken(0);
    setQuizState('user-details');
    setUserDetails(null);
  };

  const handleLeaderboardOpen = () => {
    setIsLeaderboardOpen(true);
  };

  const handleLeaderboardClose = () => {
    setIsLeaderboardOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <div className="text-white text-xl">Loading quiz...</div>
          <p className="text-gray-400 text-sm mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <p className="text-red-800 text-center mb-4">{error}</p>
          <button
            onClick={loadQuestions}
            className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'user-details') {
    return <UserDetailsForm onSubmit={handleUserDetailsSubmit} />;
  }

  if (quizState === 'welcome') {
    return (
      <>
        <LeaderboardButton onClick={handleLeaderboardOpen} />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div
          className="text-center max-w-2xl"
          style={{
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full mb-6 shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
              Quiz Challenge
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Test your knowledge across 15 challenging questions
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-400/30">
                <div className="text-emerald-300 font-semibold mb-2">
                  Standard Round
                </div>
                <div className="text-white text-sm">
                  8 questions of normal difficulty to warm you up
                </div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-4 border border-red-400/30">
                <div className="text-red-300 font-semibold mb-2">
                  Final Boss Round
                </div>
                <div className="text-white text-sm">
                  7 challenging questions to test your expertise
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xl font-bold py-5 px-12 rounded-2xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-2xl"
          >
            Start Quiz
          </button>

          <div className="mt-8 text-gray-400 text-sm">
            15 Questions • Timed Challenge • Track Your Progress
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={handleLeaderboardClose}
        currentUserEmail={userDetails?.email}
      />
      </>
    );
  }

  if (quizState === 'countdown') {
    return <Countdown onComplete={handleCountdownComplete} />;
  }

  if (quizState === 'boss-transition') {
    return <BossTransition onComplete={handleBossTransitionComplete} />;
  }

  if (quizState === 'quiz' && currentQuestion) {
    return (
      <div
        className={`min-h-screen py-8 px-4 transition-colors duration-700 ${
          currentPhase === 'boss'
            ? 'bg-gradient-to-br from-red-900 via-red-800 to-orange-900'
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h1
              className={`text-xl sm:text-2xl md:text-3xl font-bold break-words text-center sm:text-left ${
                currentPhase === 'boss' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Web Development Quiz Challenge
            </h1>
            <Timer isRunning={true} onTimeUpdate={setTimeTaken} />
          </div>

          <ProgressLine
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            phase={currentPhase}
          />

          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>
      </div>
    );
  }

  if (quizState === 'results') {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    return (
      <>
        <LeaderboardButton onClick={handleLeaderboardOpen} />
        <Results
          correctAnswers={correctAnswers}
          totalQuestions={questions.length}
          timeTaken={timeTaken}
          onRestart={restartQuiz}
          userEmail={userDetails?.email}
        />
        <LeaderboardModal 
          isOpen={isLeaderboardOpen} 
          onClose={handleLeaderboardClose}
          currentUserEmail={userDetails?.email}
        />
      </>
    );
  }

  return null;
}

export default App;
