const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all published blog posts
// @route   GET /api/blog
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    // Build query
    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content'); // Don't include full content in list

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages,
      currentPage: page,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get featured blog posts
// @route   GET /api/blog/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const posts = await Blog.getFeaturedPosts();

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name email avatar bio socialLinks');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    await post.incrementViews();

    // Get related posts
    const relatedPosts = await Blog.find({
      _id: { $ne: post._id },
      status: 'published',
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } }
      ]
    })
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('-content');

    res.json({
      success: true,
      data: {
        post,
        relatedPosts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Public
router.post('/:id/comments', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    if (post.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot comment on unpublished posts'
      });
    }

    const { name, email, comment } = req.body;

    // Add comment (auto-approve for now, can be changed to require moderation)
    await post.addComment({
      name,
      email,
      comment,
      isApproved: true
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
router.post('/', protect, authorize('admin', 'editor', 'author'), [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('excerpt')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Excerpt must be between 20 and 300 characters'),
  body('content')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
  body('category')
    .isIn([
      'Graphic Design', 'Branding', 'Marketing', 'Web Design', 'Social Media',
      'Typography', 'Color Theory', 'Layout Design', 'Print Design', 'Digital Art',
      'UI/UX Design', 'Illustration', 'Photography', 'Animation', 'Other'
    ])
    .withMessage('Please select a valid category'),
  body('featuredImage.url')
    .notEmpty()
    .withMessage('Featured image URL is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      status = 'draft',
      isFeatured = false,
      seo
    } = req.body;

    const post = await Blog.create({
      title,
      excerpt,
      content,
      category,
      tags: tags || [],
      featuredImage,
      status,
      isFeatured,
      seo,
      author: req.user.id,
      authorName: req.user.name
    });

    await post.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
router.put('/:id', protect, authorize('admin', 'editor', 'author'), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Excerpt must be between 20 and 300 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check ownership (authors can only edit their own posts)
    if (req.user.role === 'author' && post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // Update post
    post = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar');

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
router.delete('/:id', protect, authorize('admin', 'editor', 'author'), async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check ownership (authors can only delete their own posts)
    if (req.user.role === 'author' && post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.remove();

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router; 