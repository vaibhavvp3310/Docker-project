import React from 'react';

function BookmarkList({ bookmarks, onDelete }) {
  if (bookmarks.length === 0) {
    return <p className="empty">No bookmarks yet. Add your first one above!</p>;
  }

  return (
    <div className="bookmark-list">
      {bookmarks.map((bm) => (
        <div key={bm._id} className="bookmark-card">
          <div>
            <h3>
              <a href={bm.url} target="_blank" rel="noopener noreferrer">
                {bm.title}
              </a>
            </h3>
            <span className="url">{bm.url}</span>
            {bm.description && <p className="description">{bm.description}</p>}
            {bm.tags.length > 0 && (
              <div className="tags">
                {bm.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            className="delete-btn"
            onClick={() => onDelete(bm._id)}
            title="Delete bookmark"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default BookmarkList;
