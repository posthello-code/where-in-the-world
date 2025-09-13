import React from 'react';
import { GuessHistory } from '../types/game';

interface GuessHistoryProps {
  guessHistory: GuessHistory[];
}

const GuessHistoryComponent: React.FC<GuessHistoryProps> = ({ guessHistory }) => {
  if (guessHistory.length === 0) {
    return null;
  }

  return (
    <div className="guess-history">
      <h3>Previous Guesses</h3>
      <div className="guess-list">
        {guessHistory.map((entry, index) => (
          <div
            key={`${entry.timestamp}-${index}`}
            className={`guess-entry ${entry.result.points > 0 ? 'correct' : 'incorrect'}`}
          >
            <span className="guess-text">"{entry.guess}"</span>
            {entry.result.points > 0 ? (
              <span className="guess-result correct">
                ✓ {entry.result.match} ({entry.result.type}) +{entry.result.points}pts
              </span>
            ) : (
              <span className="guess-result incorrect">✗ Incorrect</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuessHistoryComponent;