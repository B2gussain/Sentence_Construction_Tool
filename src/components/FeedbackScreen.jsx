function FeedbackScreen({ questions, userAnswers }) {
    const calculateScore = () => {
      let score = 0;
      questions.forEach((question, index) => {
        const userAnswer = userAnswers[index] || [];
        const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
        if (isCorrect) score++;
      });
      return score;
    };
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#1A202C] mb-6">Results</h2>
        <div className="bg-[#EDF2F7] p-4 rounded-lg mb-6">
          <p className="text-lg font-medium text-[#1A202C]">
            Your Score: <span className="text-[#4A90E2]">{calculateScore()}</span> / 10
          </p>
        </div>
  
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index] || [];
            const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
  
            return (
              <div key={question.questionId} className="border border-[#E2E8F0] p-4 rounded-lg">
                <p className="mb-2 text-[#1A202C] font-medium">{question.question}</p>
                <p className="text-sm text-[#718096]">
                  Your Answer: <span className={isCorrect ? 'text-[#48BB78]' : 'text-[#E53E3E]'}>
                    {userAnswer.join(', ') || 'Not answered'}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-[#718096]">
                    Correct Answer: <span className="text-[#48BB78]">{question.correctAnswer.join(', ')}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  export default FeedbackScreen;