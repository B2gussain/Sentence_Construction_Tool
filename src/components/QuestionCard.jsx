import { useState, useEffect } from 'react';

function QuestionCard({ question, onComplete, onQuit, questionNumber, totalQuestions }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const blanksCount = 4;
  const [selectedWords, setSelectedWords] = useState(Array(blanksCount).fill(null));
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false); // State for alert visibility
  const [originalOptions, setOriginalOptions] = useState([]); // Store original options
  const [availableOptions, setAvailableOptions] = useState([]); // State for available options

  // Reset on new question
  useEffect(() => {
    setTimeLeft(60);
    setSelectedWords(Array(blanksCount).fill(null));
    setHasSubmitted(false);
    const initialOptions = [...question.options];
    setOriginalOptions(initialOptions);
    setAvailableOptions(initialOptions); // Initialize available options
    console.log('New question loaded, originalOptions:', initialOptions); // Debug log
  }, [question]);

  // Update availableOptions when selectedWords changes
  useEffect(() => {
    const updatedOptions = originalOptions.filter(option => !selectedWords.includes(option));
    setAvailableOptions(updatedOptions);
    console.log('Selected words updated, availableOptions:', updatedOptions); // Debug log
  }, [selectedWords, originalOptions]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!hasSubmitted) {
      setHasSubmitted(true);
      onComplete(selectedWords); // Send even incomplete answers
    }
  }, [timeLeft, hasSubmitted]);

  const handleWordClick = (word) => {
    const nextEmptyIndex = selectedWords.findIndex(slot => slot === null);
    if (nextEmptyIndex !== -1) {
      const newSelectedWords = [...selectedWords];
      newSelectedWords[nextEmptyIndex] = word;
      setSelectedWords(newSelectedWords);
      console.log('Selected words after click:', newSelectedWords); // Debug log
    }
  };

  const handleBlankClick = (index) => {
    if (selectedWords[index]) {
      const removedWord = selectedWords[index];
      const newSelectedWords = [...selectedWords];
      newSelectedWords[index] = null;
      setSelectedWords(newSelectedWords);
      console.log('Removed word from blank, new selectedWords:', newSelectedWords); // Debug log
    }
  };

  const renderSentence = () => {
    const parts = question.question.split(/(___+)/);
    let blankIndex = 0;

    return parts.map((part, index) => {
      if (part.includes('___') && blankIndex < blanksCount) {
        const currentBlank = (
          <span
            key={`blank-${blankIndex}`}
            className="inline-block min-w-[80px] sm:min-w-[120px] h-10 border-b-2 border-[#E2E8F0] mx-2 cursor-pointer bg-white px-2 text-center align-middle text-[#718096]"
            onClick={() => handleBlankClick(blankIndex)}
          >
            {selectedWords[blankIndex] || ''}
          </span>
        );
        blankIndex++;
        return currentBlank;
      } else {
        return (
          <span key={`part-${index}`} className="break-words text-[#1A202C]">
            {part}
          </span>
        );
      }
    });
  };

  const handleNextClick = () => {
    if (!hasSubmitted && selectedWords.every(word => word !== null)) {
      setHasSubmitted(true);
      onComplete(selectedWords);
    }
  };

  const handleQuitClick = () => {
    setShowQuitConfirm(true); // Show the custom alert
  };

  const handleConfirmQuit = () => {
    onQuit(); // Proceed to quit
    setShowQuitConfirm(false); // Hide the alert
  };

  const handleCancelQuit = () => {
    setShowQuitConfirm(false); // Hide the alert without quitting
  };

  const handleResetClick = () => {
    setSelectedWords(Array(blanksCount).fill(null)); // Reset selected words without affecting time
    console.log('Reset clicked, selectedWords cleared:', Array(blanksCount).fill(null)); // Debug log
  };

  // Timer color 
  const timerColor = timeLeft <= 10
    ? 'text-red-500'
    : timeLeft <= 20
    ? 'text-yellow-500'
    : 'text-green-500';

  return (
    <div className="bg-white pb-[50px] p-6 relative rounded-xl shadow-lg w-full max-w-2xl mx-auto">
       
      <div className="flex justify-between items-center mb-6">
        <span className={`text-[16px] font-bold ${timerColor}`}>
          Time Left: {timeLeft}s
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleQuitClick}
            className="w-[90px] h-[40px] rounded-[10px] bg-[#EDF2F7] text-[#1A202C] font-semibold hover:bg-[#E2E8F0] transition-colors"
          >
            Quit
          </button>
          <button
            onClick={handleResetClick}
            className="w-[90px] h-[40px] rounded-[10px] bg-[#ff2525] text-white font-semibold hover:bg-[#f84c35] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      
      <div className="mb-8 text-lg font-medium flex flex-wrap text-wrap gap-1 leading-relaxed">
        {renderSentence()}
      </div>

      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {availableOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleWordClick(option)}
            className="w-full h-12 rounded-[10px] bg-[#EDF2F7] text-[#1A202C] font-medium hover:bg-[#E2E8F0] disabled:bg-[#CBD5E0] disabled:cursor-not-allowed transition-colors"
            disabled={selectedWords.every(word => word !== null)}
          >
            {option}
          </button>
        ))}
      </div>

      
      <button
        onClick={handleNextClick}
        disabled={!selectedWords.every(word => word !== null)}
        className="w-[40px] h-[40px] right-[10px] bottom-[10px] bg-[#3c1181] text-[#f3f3f3] font-extrabold rounded-[5px] absolute disabled:bg-[#CBD5E0] disabled:cursor-not-allowed hover:bg-[#4d1a8f] transition-colors"
      >
        →
      </button>

      
      {showQuitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-6 w-[90%] max-w-[400px] text-center shadow-lg">
            <h3 className="text-lg font-semibold text-[#1A202C] mb-4">Quit</h3>
            <p className="text-[#718096] mb-6">
              Are you sure you want to quit? This will end the test and show your results.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelQuit}
                className="w-[100px] h-[40px] rounded-[10px] bg-[#EDF2F7] text-[#1A202C] font-medium hover:bg-[#E2E8F0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmQuit}
                className="w-[100px] h-[40px] bg-[#fc2828] text-white rounded-[10px] font-medium hover:bg-[#fa3636] transition-colors"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
