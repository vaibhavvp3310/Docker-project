import React from 'react';

function TagFilter({ tags, activeTag, onSelectTag }) {
  if (tags.length === 0) return null;

  return (
    <div className="tag-filter">
      <button
        className={`tag-btn ${activeTag === '' ? 'active' : ''}`}
        onClick={() => onSelectTag('')}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
          onClick={() => onSelectTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default TagFilter;
