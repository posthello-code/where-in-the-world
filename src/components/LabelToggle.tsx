import React from 'react';

interface LabelToggleProps {
  showLabels: boolean;
  onToggle: () => void;
}

const LabelToggle: React.FC<LabelToggleProps> = ({ showLabels, onToggle }) => {
  return (
    <label className={`label-toggle ${showLabels ? 'disabled' : ''}`}>
      <span className="toggle-label">Show Labels</span>
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={onToggle}
          disabled={showLabels}
          className="toggle-input"
        />
        <span className="toggle-slider"></span>
      </div>
      <span className="toggle-penalty">
        {showLabels ? '(used this zoom)' : '(-1 point)'}
      </span>
    </label>
  );
};

export default LabelToggle;