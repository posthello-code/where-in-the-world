import React, { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import GameHeader from './components/GameHeader';
import GameMap from './components/GameMap';
import GuessInput from './components/GuessInput';
import GameControls from './components/GameControls';
import LabelToggle from './components/LabelToggle';
import MapStyleToggle from './components/MapStyleToggle';
import GuessedItems from './components/GuessedItems';
import GuessHistory from './components/GuessHistory';
import './App.css';

const App: React.FC = () => {
  const { gameState, feedback, startNewGame, handleGuess, giveUp, toggleLabels, toggleRevealCategory, toggleMapStyle } = useGame();

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <div className="game-container">
      <GameHeader score={gameState.score} zoom={gameState.currentZoom} />

      <div className="instructions">
        Study the map and type your guess below. Each wrong guess zooms out.<br />
        <strong>Scoring:</strong> Country = 1pt | Province = 2pts | City = 3pts | Point of Interest = 5pts
      </div>

      <div className="label-toggle-container">
        <LabelToggle
          showLabels={gameState.showLabels}
          onToggle={toggleLabels}
        />
        <MapStyleToggle
          mapStyle={gameState.mapStyle}
          onToggle={toggleMapStyle}
        />
      </div>

      <div className="map-container">
        <GameMap
          targetLocation={gameState.targetLocation}
          zoom={gameState.currentZoom}
          gameActive={gameState.gameActive}
          showLabels={gameState.showLabels}
          mapStyle={gameState.mapStyle}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
        />
      </div>

      <GuessInput
        onGuess={handleGuess}
        gameActive={gameState.gameActive}
        feedback={feedback}
      />

      <GuessedItems
        targetLocation={gameState.targetLocation}
        guessedItems={gameState.guessedItems}
        currentScore={gameState.score}
        showLabels={gameState.showLabels}
        revealedCategories={gameState.revealedCategories}
        onToggleReveal={toggleRevealCategory}
      />

      <GuessHistory guessHistory={gameState.guessHistory} />

      <GameControls
        onNewGame={startNewGame}
        onGiveUp={giveUp}
        gameActive={gameState.gameActive}
      />
    </div>
  );
};

export default App;