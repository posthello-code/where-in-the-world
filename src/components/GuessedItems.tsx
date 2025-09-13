import React from 'react';
import { Location } from '../types/game';

interface GuessedItemsProps {
  targetLocation: Location | null;
  guessedItems: {
    country?: string;
    province?: string;
    city?: string;
    pointsOfInterest: string[];
  };
  currentScore: number;
  showLabels: boolean;
  revealedCategories: {
    country: boolean;
    province: boolean;
    city: boolean;
    pointsOfInterest: boolean;
  };
  onToggleReveal: (category: 'country' | 'province' | 'city' | 'pointsOfInterest') => void;
}

const GuessedItems: React.FC<GuessedItemsProps> = ({ targetLocation, guessedItems, currentScore, showLabels, revealedCategories, onToggleReveal }) => {
  if (!targetLocation) return null;

  const calculateMaxPoints = () => {
    let maxPoints = 0;

    // Count available categories (not revealed)
    const availableCategories = [];
    availableCategories.push('country'); // Always present
    if (targetLocation.province) availableCategories.push('province');
    availableCategories.push('city'); // Always present
    availableCategories.push('pointsOfInterest'); // Always present

    // Calculate points for each category
    maxPoints += 1; // Country
    if (targetLocation.province) maxPoints += 2; // Province
    maxPoints += 3; // City
    maxPoints += targetLocation.pointsOfInterest.length * 5; // Points of interest

    // Adjust for labels penalty (-1 per category, minimum 1 point per category)
    if (showLabels) {
      const totalCategories = availableCategories.length;
      const poiCount = targetLocation.pointsOfInterest.length;
      // Each category loses 1 point, but minimum 1 point each
      // Country: 1-1 = 0, but min 1 = 1
      // Province: 2-1 = 1
      // City: 3-1 = 2
      // POI: 5-1 = 4 each
      maxPoints = 1 + (targetLocation.province ? 1 : 0) + 2 + (poiCount * 4);
    }

    return maxPoints;
  };

  const maxPossiblePoints = calculateMaxPoints();

  return (
    <div className="guessed-items">
      <div className="points-summary">
        <h3>Available to Guess:</h3>
        <div className="score-display">
          <span className="current-score">{currentScore}</span>
          <span className="score-separator">/</span>
          <span className="max-score">{maxPossiblePoints}</span>
          <span className="points-label">points</span>
        </div>
      </div>
      <div className="guess-categories">
        <div className="guess-category">
          <div className="category-header">
            <span className="category-label">Country (1pt):</span>
            <label className="reveal-toggle">
              <input
                type="checkbox"
                checked={revealedCategories.country}
                onChange={() => onToggleReveal('country')}
              />
              <span className="reveal-slider"></span>
              <span className="reveal-label">Reveal</span>
            </label>
          </div>
          {revealedCategories.country ? (
            <span className="revealed-answer">{targetLocation.country}</span>
          ) : (
            <span className={guessedItems.country ? 'guessed' : 'hidden'}>
              {guessedItems.country ? targetLocation.country : '???'}
            </span>
          )}
        </div>

        {targetLocation.province && (
          <div className="guess-category">
            <div className="category-header">
              <span className="category-label">Province (2pts):</span>
              <label className="reveal-toggle">
                <input
                  type="checkbox"
                  checked={revealedCategories.province}
                  onChange={() => onToggleReveal('province')}
                />
                <span className="reveal-slider"></span>
                <span className="reveal-label">Reveal</span>
              </label>
            </div>
            {revealedCategories.province ? (
              <span className="revealed-answer">{targetLocation.province}</span>
            ) : (
              <span className={guessedItems.province ? 'guessed' : 'hidden'}>
                {guessedItems.province ? targetLocation.province : '???'}
              </span>
            )}
          </div>
        )}

        <div className="guess-category">
          <div className="category-header">
            <span className="category-label">City (3pts):</span>
            <label className="reveal-toggle">
              <input
                type="checkbox"
                checked={revealedCategories.city}
                onChange={() => onToggleReveal('city')}
              />
              <span className="reveal-slider"></span>
              <span className="reveal-label">Reveal</span>
            </label>
          </div>
          {revealedCategories.city ? (
            <span className="revealed-answer">{targetLocation.city}</span>
          ) : (
            <span className={guessedItems.city ? 'guessed' : 'hidden'}>
              {guessedItems.city ? targetLocation.city : '???'}
            </span>
          )}
        </div>

        <div className="guess-category">
          <div className="category-header">
            <span className="category-label">Points of Interest (5pts each):</span>
            <label className="reveal-toggle">
              <input
                type="checkbox"
                checked={revealedCategories.pointsOfInterest}
                onChange={() => onToggleReveal('pointsOfInterest')}
              />
              <span className="reveal-slider"></span>
              <span className="reveal-label">Reveal</span>
            </label>
          </div>
          {revealedCategories.pointsOfInterest ? (
            <div className="revealed-answer poi-list">
              {targetLocation.pointsOfInterest.join(', ')}
            </div>
          ) : (
            <div className="poi-list">
              {targetLocation.pointsOfInterest.map((poi, index) => (
                <span
                  key={index}
                  className={guessedItems.pointsOfInterest.includes(poi) ? 'guessed' : 'hidden'}
                >
                  {guessedItems.pointsOfInterest.includes(poi) ? poi : '???'}
                  {index < targetLocation.pointsOfInterest.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessedItems;