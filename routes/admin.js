const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts
    const totalPosts = await Blog.countDocuments();
    const publishedPosts = await Blog.countDocuments({ status: 'published' });
    const draftPosts = await Blog.countDocuments({ status: 'draft' });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get recent posts
    const recentPosts = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get popular posts (by views)
    const popularPosts = await Blog.find({ status: 'published' })
      .populate('author', 'name email')
      .sort({ views: -1 })
      .limit(5);

    // Get monthly post counts for the last 6 months
    const monthlyStats = await Blog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalPosts,
          publishedPosts,
          draftPosts,
          totalUsers,
          activeUsers
        },
        recentPosts,
        popularPosts,
        monthlyStats
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

// @desc    Get all blog posts (admin view)
// @route   GET /api/admin/posts
// @access  Private/Admin
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

// @desc    Update blog post status
// @route   PUT /api/admin/posts/:id/status
// @access  Private/Admin
router.put('/posts/:id/status', [
  body('status')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
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

    const { status } = req.body;

    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post status updated successfully',
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

// @desc    Toggle featured status
// @route   PUT /api/admin/posts/:id/featured
// @access  Private/Admin
router.put('/posts/:id/featured', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    post.isFeatured = !post.isFeatured;
    await post.save();

    res.json({
      success: true,
      message: `Post ${post.isFeatured ? 'featured' : 'unfeatured'} successfully`,
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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const isActive = req.query.isActive;

    // Build query
    let query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .populate('postsCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages,
      currentPage: page,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', [
  body('role')
    .isIn(['admin', 'editor', 'author'])
    .withMessage('Role must be admin, editor, or author')
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

    const { role } = req.body;

    // Prevent admin from changing their own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', async (req, res) => {
  try {
    // Prevent admin from deactivating themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isActive) {
      await user.deactivate();
    } else {
      await user.activate();
    }

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get comments for moderation
// @route   GET /api/admin/comments
// @access  Private/Admin
router.get('/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const isApproved = req.query.isApproved;

    // Build query for comments
    let commentQuery = {};
    if (isApproved !== undefined) {
      commentQuery['comments.isApproved'] = isApproved === 'true';
    }

    const posts = await Blog.find(commentQuery)
      .populate('author', 'name email')
      .sort({ 'comments.createdAt': -1 })
      .skip(skip)
      .limit(limit);

    // Extract comments from posts
    let allComments = [];
    posts.forEach(post => {
      post.comments.forEach(comment => {
        if (isApproved === undefined || comment.isApproved === (isApproved === 'true')) {
          allComments.push({
            _id: comment._id,
            name: comment.name,
            email: comment.email,
            comment: comment.comment,
            createdAt: comment.createdAt,
            isApproved: comment.isApproved,
            postId: post._id,
            postTitle: post.title,
            postSlug: post.slug
          });
        }
      });
    });

    // Sort comments by creation date
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = await Blog.aggregate([
      { $match: commentQuery },
      { $unwind: '$comments' },
      { $count: 'total' }
    ]);

    const totalComments = total.length > 0 ? total[0].total : 0;
    const totalPages = Math.ceil(totalComments / limit);

    res.json({
      success: true,
      count: allComments.length,
      total: totalComments,
      totalPages,
      currentPage: page,
      data: allComments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Approve/reject comment
// @route   PUT /api/admin/comments/:commentId
// @access  Private/Admin
router.put('/comments/:commentId', [
  body('isApproved')
    .isBoolean()
    .withMessage('isApproved must be a boolean')
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

    const { isApproved } = req.body;

    const post = await Blog.findOneAndUpdate(
      { 'comments._id': req.params.commentId },
      { $set: { 'comments.$.isApproved': isApproved } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: `Comment ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:commentId
// @access  Private/Admin
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { 'comments._id': req.params.commentId },
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
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