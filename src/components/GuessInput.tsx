import React, { useState } from 'react';
import { FeedbackType } from '../types/game';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  gameActive: boolean;
  feedback: { message: string; type: FeedbackType };
}

const GuessInput: React.FC<GuessInputProps> = ({ onGuess, gameActive, feedback }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!gameActive || !inputValue.trim()) return;
    onGuess(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="guess-section">
      <div className="guess-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter country, province, city, or point of interest (e.g., France, England, Paris, Eiffel Tower)"
          maxLength={100}
          disabled={!gameActive}
          className="guess-input"
        />
        <button
          onClick={handleSubmit}
          disabled={!gameActive}
          className="btn submit-guess"
        >
          Submit Guess
        </button>
      </div>
      <div className={`guess-feedback ${feedback.type}`}>
        {feedback.message}
      </div>
    </div>
  );
};

export default GuessInput;