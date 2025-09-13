import React from 'react';

interface GameHeaderProps {
  score: number;
  zoom: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, zoom }) => {
  return (
    <div className="game-header">
      <h1>Where in the World?</h1>
      <div className="game-stats">
        <div className="score">Score: <span>{score}</span></div>
        <div className="zoom-level">Zoom Level: <span>{zoom}</span></div>
      </div>
    </div>
  );
};

export default GameHeader;