import { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import FeedbackScreen from './components/FeedbackScreen';
import questionsData from './data/questions.json';
import { MdOutlineEditNote } from "react-icons/md";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testStarted, setTestStarted] = useState(false); // New state for test start

  useEffect(() => {
    setQuestions(questionsData.data.questions);
  }, []);

  const handleComplete = (answers) => {
    setUserAnswers(prev => [...prev, answers]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleQuit = () => {
    setIsCompleted(true); // End test and go to results
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  if (!questions.length) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold text-[#1A202C]">Sentence Construction</h1>
          {testStarted && !isCompleted && (
            <div className="text-sm text-[#718096]">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        {!testStarted ? (
          <div className="rounded-xl w-[70vw] text-center">
            <div className="mb-6">
              <MdOutlineEditNote className="h-[50px] w-[50px] inline" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1A202C] mb-4">Sentence Construction</h2>
            <p className="text-[#718096] mb-8">
              User have to construct a sentence with random words by placing it in a correct order.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 text-left">
              <div className="text-center">
                <p className="text-[#1A202C] text-sm">Time Per Question</p>
                <p className="text-[#718096] font-medium">1 minute</p>
              </div>
              <div className="text-center">
                <p className="text-[#1A202C] text-sm">Total Questions</p>
                <p className="text-[#718096] font-medium">10</p>
              </div>
              <div className="text-center">
                <p className="text-[#1A202C] text-sm">Coins</p>
                <p className="text-[#718096] font-medium">20 coins</p>
              </div>
            </div>
            <button
              onClick={handleStartTest}
              className="w-[150px] h-12 bg-[#3c1181] text-white rounded-[10px] font-medium hover:bg-[#4d1a8f] transition-colors"
            >
              Start
            </button>
          </div>
        ) : !isCompleted ? (
          <QuestionCard
            question={questions[currentQuestion]}
            onComplete={handleComplete}
            onQuit={handleQuit} // Added quit handler
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />
        ) : (
          <FeedbackScreen questions={questions} userAnswers={userAnswers} />
        )}
      </main>
    </div>
  );
}

export default App;