import { useState, useCallback } from 'react';
import { GameState, GuessResult, Location, FeedbackType, GuessHistory, MapStyle } from '../types/game';
import { locations } from '../data/locations';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentZoom: 19,
    gameActive: false,
    targetLocation: null,
    showLabels: false, // Labels off by default
    mapStyle: 'street', // Default to street map
    guessedItems: {
      pointsOfInterest: [],
    },
    revealedCategories: {
      country: false,
      province: false,
      city: false,
      pointsOfInterest: false,
    },
    guessHistory: [],
  });

  const [feedback, setFeedback] = useState<{ message: string; type: FeedbackType }>({
    message: '',
    type: '',
  });

  const generateRandomLocation = useCallback((): Location => {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  }, []);

  const checkIfGameComplete = useCallback((location: Location | null, guessed: any, revealed: any): boolean => {
    if (!location) return false;

    // Check if all categories are either guessed or revealed
    const countryComplete = guessed.country || revealed.country;
    const provinceComplete = !location.province || guessed.province || revealed.province;
    const cityComplete = guessed.city || revealed.city;
    const poiComplete = revealed.pointsOfInterest || location.pointsOfInterest.every(poi => guessed.pointsOfInterest.includes(poi));

    return countryComplete && provinceComplete && cityComplete && poiComplete;
  }, []);

  const checkGuess = useCallback((guess: string, location: Location): GuessResult => {
    const normalizedGuess = guess.toLowerCase().trim();

    // Check for exact city match (3 points) - case insensitive
    if (!gameState.revealedCategories.city && (normalizedGuess === location.city.toLowerCase() || normalizedGuess === location.name.toLowerCase())) {
      return { points: 3, type: 'city', match: location.city };
    }

    // Check city variations if they exist
    if (!gameState.revealedCategories.city && location.cityVariations) {
      for (const variation of location.cityVariations) {
        if (normalizedGuess === variation.toLowerCase()) {
          return { points: 3, type: 'city', match: location.city };
        }
      }
    }

    // Check for province/state/region match (2 points) - case insensitive
    if (!gameState.revealedCategories.province && location.province && normalizedGuess === location.province.toLowerCase()) {
      return { points: 2, type: 'province', match: location.province };
    }

    // Check for country match (1 point) - case insensitive
    if (!gameState.revealedCategories.country && normalizedGuess === location.country.toLowerCase()) {
      return { points: 1, type: 'country', match: location.country };
    }

    // Check for point of interest match (5 points) - case insensitive
    if (!gameState.revealedCategories.pointsOfInterest) {
      for (const poi of location.pointsOfInterest) {
        if (normalizedGuess === poi.toLowerCase()) {
          return { points: 5, type: 'point of interest', match: poi };
        }
      }
    }

    // Check for partial matches (case insensitive)
    const guessParts = normalizedGuess.split(',').map(part => part.trim().toLowerCase());

    // Check if any part of the guess matches city, country, or natural features
    for (const part of guessParts) {
      if (!gameState.revealedCategories.city && part === location.city.toLowerCase()) {
        return { points: 3, type: 'city', match: location.city };
      }

      // Check city variations in partial matches
      if (!gameState.revealedCategories.city && location.cityVariations) {
        for (const variation of location.cityVariations) {
          if (part === variation.toLowerCase()) {
            return { points: 3, type: 'city', match: location.city };
          }
        }
      }

      if (!gameState.revealedCategories.province && location.province && part === location.province.toLowerCase()) {
        return { points: 2, type: 'province', match: location.province };
      }

      if (!gameState.revealedCategories.country && part === location.country.toLowerCase()) {
        return { points: 1, type: 'country', match: location.country };
      }

      // Check points of interest (case insensitive)
      if (!gameState.revealedCategories.pointsOfInterest) {
        for (const poi of location.pointsOfInterest) {
          if (part === poi.toLowerCase()) {
            return { points: 5, type: 'point of interest', match: poi };
          }
        }
      }
    }

    return { points: 0, type: 'none', match: null };
  }, [gameState.revealedCategories]);

  const startNewGame = useCallback(() => {
    const newLocation = generateRandomLocation();
    setGameState(prev => ({
      score: 0,
      currentZoom: 19,
      gameActive: true,
      targetLocation: newLocation,
      showLabels: false, // Reset labels on new game
      mapStyle: prev.mapStyle, // Preserve map style setting
      guessedItems: {
        pointsOfInterest: [],
      },
      revealedCategories: {
        country: false,
        province: false,
        city: false,
        pointsOfInterest: false,
      },
      guessHistory: [], // Reset guess history on new game
    }));
    setFeedback({ message: '', type: '' });
  }, [generateRandomLocation]);

  const handleGuess = useCallback((guess: string) => {
    if (!gameState.gameActive || !gameState.targetLocation) return;

    if (!guess.trim()) {
      setFeedback({ message: 'Please enter a guess!', type: 'error' });
      return;
    }

    const result = checkGuess(guess, gameState.targetLocation);

    // Add guess to history
    const historyEntry: GuessHistory = {
      guess: guess.trim(),
      result,
      timestamp: Date.now()
    };

    if (result.points > 0) {
      // Reduce points by 1 if labels are enabled, but minimum 1 point
      const adjustedPoints = gameState.showLabels ? Math.max(1, result.points - 1) : result.points;
      const newScore = gameState.score + adjustedPoints;

      // Update guessed items
      const newGuessedItems = { ...gameState.guessedItems };
      if (result.type === 'country') {
        newGuessedItems.country = result.match!;
      } else if (result.type === 'province') {
        newGuessedItems.province = result.match!;
      } else if (result.type === 'city') {
        newGuessedItems.city = result.match!;
      } else if (result.type === 'point of interest') {
        newGuessedItems.pointsOfInterest = [...newGuessedItems.pointsOfInterest, result.match!];
      }

      setGameState(prev => ({
        ...prev,
        score: newScore,
        guessedItems: newGuessedItems,
        guessHistory: [...prev.guessHistory, historyEntry]
      }));

      const pointsText = gameState.showLabels && result.points > 1
        ? `+${adjustedPoints} points (${result.points}-1 for labels)`
        : `+${adjustedPoints} points`;

      setFeedback({
        message: `Correct! You guessed the ${result.type}: "${result.match}" (${pointsText})`,
        type: 'correct'
      });

      // Check if game is complete after this guess
      if (checkIfGameComplete(gameState.targetLocation, newGuessedItems, gameState.revealedCategories)) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, gameActive: false }));
          setFeedback({
            message: `🎉 Game Complete! You found everything! Final Score: ${newScore} points`,
            type: 'correct'
          });
        }, 1500); // Show completion message after a brief delay
      }
    } else {
      const newZoom = Math.max(1, gameState.currentZoom - 2);
      setGameState(prev => ({
        ...prev,
        currentZoom: newZoom,
        showLabels: false, // Reset labels on wrong guess
        guessHistory: [...prev.guessHistory, historyEntry]
      }));
      setFeedback({
        message: `"${guess}" is not correct. Try again!`,
        type: 'wrong'
      });
    }
  }, [gameState, checkGuess]);

  const giveUp = useCallback(() => {
    if (!gameState.gameActive) return;
    setGameState(prev => ({ ...prev, gameActive: false }));
    setFeedback({
      message: `The location was ${gameState.targetLocation?.name}`,
      type: 'error'
    });
  }, [gameState.gameActive, gameState.targetLocation]);

  const toggleLabels = useCallback(() => {
    // Can only turn labels ON, not OFF (one-way toggle)
    if (!gameState.showLabels) {
      setGameState(prev => ({ ...prev, showLabels: true }));
    }
  }, [gameState.showLabels]);

  const toggleRevealCategory = useCallback((category: 'country' | 'province' | 'city' | 'pointsOfInterest') => {
    setGameState(prev => {
      const newRevealedCategories = {
        ...prev.revealedCategories,
        [category]: !prev.revealedCategories[category]
      };

      // Check if game is complete after revealing this category
      const isComplete = checkIfGameComplete(prev.targetLocation, prev.guessedItems, newRevealedCategories);

      if (isComplete) {
        setTimeout(() => {
          setGameState(curr => ({ ...curr, gameActive: false }));
          setFeedback({
            message: `🎉 Game Complete! All items found/revealed! Final Score: ${prev.score} points`,
            type: 'correct'
          });
        }, 500);
      }

      return {
        ...prev,
        revealedCategories: newRevealedCategories
      };
    });
  }, [checkIfGameComplete]);

  const toggleMapStyle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      mapStyle: prev.mapStyle === 'street' ? 'satellite' : 'street'
    }));
  }, []);

  return {
    gameState,
    feedback,
    startNewGame,
    handleGuess,
    giveUp,
    toggleLabels,
    toggleRevealCategory,
    toggleMapStyle,
    clearFeedback: () => setFeedback({ message: '', type: '' }),
  };
};