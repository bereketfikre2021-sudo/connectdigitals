# Connect Digitals - Frontend

A modern, responsive website for Connect Digitals built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Responsive Design** - Mobile-first approach with modern UI/UX
- **Glassmorphism Effects** - Beautiful visual design with glass-like elements
- **Smooth Animations** - CSS animations and JavaScript interactions
- **SEO Optimized** - Proper meta tags, structured data, and semantic HTML
- **Blog Pagination** - Dynamic blog section with pagination (3 posts per page)
- **Contact Forms** - Multiple contact form options with validation
- **Testimonials** - Dynamic testimonials carousel
- **Analytics Integration** - Google Analytics and other tracking tools
- **Accessibility** - ARIA labels, semantic HTML, and keyboard navigation

## 📁 File Structure

```
Frontend/
├── index.html              # Main HTML file
├── index.css               # Main stylesheet
├── main.js                 # Main JavaScript file
├── navigation.js           # Navigation functionality
├── modal.js                # Modal/popup functionality
├── form.js                 # Form handling and validation
├── testimonials.js         # Testimonials carousel
├── animations.js           # CSS animations and effects
├── analytics.js            # Analytics integration
├── blog-pagination.js      # Blog pagination functionality
├── testimonial-responsive-fix.css  # Mobile responsive fixes
├── contact.php             # PHP contact form handler
├── contact-simple.php      # Simple PHP contact form
├── test-form.html          # Form testing page
├── form-test.html          # Alternative form testing
├── social-preview.html     # Social media preview page
├── privacy-policy.html     # Privacy policy page
├── terms-of-service.html   # Terms of service page
├── cookie-policy.html      # Cookie policy page
├── analytics-setup.md      # Analytics setup guide
├── Logo.svg                # Company logo
├── favicon.ico             # Website favicon
├── site.webmanifest        # PWA manifest
├── *.webp                  # Image assets
├── *.png                   # Additional images
└── *.svg                   # Social media icons
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Vanilla JS with modern features
- **PHP** - Contact form processing
- **Responsive Design** - Mobile-first approach
- **CSS Animations** - Smooth transitions and effects

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Local web server (optional, for development)

### Installation
1. Clone or download the frontend files
2. Open `index.html` in your web browser
3. For development, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Beautiful color gradients
- **Smooth Transitions**: CSS transitions for all interactive elements
- **Modern Typography**: Clean, readable fonts
- **Icon Integration**: SVG icons for social media and UI elements

## 📊 Analytics

The site includes Google Analytics integration. See `analytics-setup.md` for detailed setup instructions.

## 🔧 Customization

### Colors
Main colors are defined in CSS custom properties:
- Primary: `#B8860B` (Golden)
- Secondary: `#1a1a1a` (Dark)
- Accent: `#ff6b35` (Orange)

### Fonts
- Primary: Inter, system fonts
- Headings: Modern sans-serif stack

## 📄 Pages

- **Home** (`index.html`) - Main landing page
- **Privacy Policy** (`privacy-policy.html`)
- **Terms of Service** (`terms-of-service.html`)
- **Cookie Policy** (`cookie-policy.html`)
- **Contact Forms** (`contact.php`, `contact-simple.php`)

## 🔗 Backend Integration

This frontend is designed to work with the separate backend API. The backend is located in the `Backend/` folder and provides:

- Blog post management
- User authentication
- File uploads
- Admin panel
- Database operations

## 📝 License

This project is proprietary to Connect Digitals.

## 🤝 Support

For support or questions, please contact the development team.
