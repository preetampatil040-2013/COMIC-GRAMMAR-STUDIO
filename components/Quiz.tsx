
import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import ComicPanel from './ComicPanel';

interface QuizProps {
  questions: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showFinalResults, setShowFinalResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowFinalResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowFinalResults(false);
  };

  if (showFinalResults) {
    return (
      <ComicPanel title="MISSION COMPLETE!" color="bg-green-100" rotation="rotate-1">
        <div className="text-center py-6 space-y-4">
          <div className="text-8xl">🏆</div>
          <h3 className="comic-text text-5xl">TRAINING FINISHED!</h3>
          <p className="marker-text text-3xl">YOUR SCORE: {score} / {questions.length}</p>
          <p className="handwritten text-2xl">
            {score === questions.length ? "PERFECT PERFORMANCE, HERO!" : "GREAT EFFORT! KEEP TRAINING TO BECOME A MASTER!"}
          </p>
          <button
            onClick={handleRestart}
            className="comic-border bg-black text-white px-8 py-3 comic-text text-2xl hover:bg-gray-800 transition-all mt-4"
          >
            RETRY CHALLENGE
          </button>
        </div>
      </ComicPanel>
    );
  }

  return (
    <ComicPanel title="HERO'S CHALLENGE" color="bg-yellow-50" rotation="-rotate-1">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b-4 border-black pb-2 mb-4">
          <span className="comic-text text-xl">CHALLENGE {currentQuestionIndex + 1} OF {questions.length}</span>
          <span className="comic-text text-xl">LEVEL: EXPERT</span>
        </div>

        <h3 className="marker-text text-3xl leading-tight mb-6">
          {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = isAnswered && option === currentQuestion.correctAnswer;
            const isWrong = isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer;
            const isSelected = selectedOption === option;

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`
                  comic-border p-4 text-left handwritten text-2xl transition-all
                  ${isCorrect ? 'bg-green-400 scale-105' : isWrong ? 'bg-red-400' : isSelected ? 'bg-blue-300' : 'bg-white hover:bg-gray-50'}
                  flex items-center gap-4
                `}
              >
                <span className="comic-text text-xl opacity-40">{String.fromCharCode(65 + idx)})</span>
                <span className="flex-1">{option}</span>
                {isCorrect && <span className="text-3xl">✅</span>}
                {isWrong && <span className="text-3xl">❌</span>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`comic-border p-4 mt-6 animate-in fade-in slide-in-from-top-2 ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="comic-text text-2xl mb-2 flex items-center gap-2">
              {selectedOption === currentQuestion.correctAnswer ? "💥 BOOM! CORRECT!" : "💥 OUCH! NOT QUITE!"}
            </p>
            <p className="handwritten text-xl font-bold">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={`comic-border px-8 py-3 comic-text text-2xl transition-all ${!selectedOption ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="comic-border bg-black text-white px-8 py-3 comic-text text-2xl hover:bg-gray-800 transition-all"
            >
              {currentQuestionIndex === questions.length - 1 ? "FINISH MISSION" : "NEXT CHALLENGE"}
            </button>
          )}
        </div>
      </div>
    </ComicPanel>
  );
};

export default Quiz;
