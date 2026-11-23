const express = require('express');
const { body, validationResult } = require('express-validator');
const Bookmark = require('../models/Bookmark');

const router = express.Router();

// GET /api/bookmarks - list all bookmarks, optionally filter by tag
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error('Error fetching bookmarks:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// GET /api/bookmarks/tags - get all unique tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Bookmark.distinct('tags');
    res.json(tags.sort());
  } catch (err) {
    console.error('Error fetching tags:', err.message);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// GET /api/bookmarks/:id - get a single bookmark
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json(bookmark);
  } catch (err) {
    console.error('Error fetching bookmark:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
});

// POST /api/bookmarks - create a new bookmark
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('url').trim().isURL().withMessage('Valid URL is required'),
    body('description').optional().trim(),
    body('tags').optional().isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const bookmark = new Bookmark({
        title: req.body.title,
        url: req.body.url,
        description: req.body.description || '',
        tags: req.body.tags || [],
      });
      await bookmark.save();
      res.status(201).json(bookmark);
    } catch (err) {
      console.error('Error creating bookmark:', err.message);
      res.status(500).json({ error: 'Failed to create bookmark' });
    }
  }
);

// PUT /api/bookmarks/:id - update a bookmark
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        tags: req.body.tags,
      },
      { new: true, runValidators: true }
    );
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json(bookmark);
  } catch (err) {
    console.error('Error updating bookmark:', err.message);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// DELETE /api/bookmarks/:id - delete a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    console.error('Error deleting bookmark:', err.message);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

module.exports = router;
