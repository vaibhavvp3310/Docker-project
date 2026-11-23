import React, { useState } from 'react';

function BookmarkForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    onAdd({ title: title.trim(), url: url.trim(), description: description.trim(), tags });

    setTitle('');
    setUrl('');
    setDescription('');
    setTagsInput('');
  };

  return (
    <form className="bookmark-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated: docker, devops, linux)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      <button type="submit">Save Bookmark</button>
    </form>
  );
}

export default BookmarkForm;
