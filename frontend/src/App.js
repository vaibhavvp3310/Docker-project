import React, { useState, useEffect, useCallback } from 'react';
import BookmarkForm from './components/BookmarkForm';
import BookmarkList from './components/BookmarkList';
import TagFilter from './components/TagFilter';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const params = activeTag ? `?tag=${encodeURIComponent(activeTag)}` : '';
      const res = await fetch(`${API_URL}/bookmarks${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookmarks(data);
      setError('');
    } catch (err) {
      setError('Could not load bookmarks. Is the API running?');
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/bookmarks/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const data = await res.json();
      setTags(data);
    } catch {
      // Tags are optional, don't show an error
    }
  };

  useEffect(() => {
    fetchBookmarks();
    fetchTags();
  }, [fetchBookmarks]);

  const addBookmark = async (bookmark) => {
    try {
      const res = await fetch(`${API_URL}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmark),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0]?.msg || 'Failed to save');
      }
      fetchBookmarks();
      fetchTags();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
      fetchBookmarks();
      fetchTags();
    } catch {
      setError('Failed to delete bookmark');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>&#128278; LinkStash</h1>
        <p>Your personal bookmark manager</p>
      </header>
      <main className="app-main">
        <BookmarkForm onAdd={addBookmark} />
        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onSelectTag={setActiveTag}
        />
        {error && <div className="error">{error}</div>}
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <BookmarkList bookmarks={bookmarks} onDelete={deleteBookmark} />
        )}
      </main>
    </div>
  );
}

export default App;
