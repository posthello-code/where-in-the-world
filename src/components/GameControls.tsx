import React from 'react';

interface GameControlsProps {
  onNewGame: () => void;
  onGiveUp: () => void;
  gameActive: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame, onGiveUp, gameActive }) => {
  return (
    <div className="game-controls">
      <button onClick={onNewGame} className="btn">
        New Game
      </button>
      <button
        onClick={onGiveUp}
        className="btn secondary"
        disabled={!gameActive}
      >
        Give Up
      </button>
    </div>
  );
};

export default GameControls;