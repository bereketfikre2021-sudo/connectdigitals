const User = require('../models/User');
const Blog = require('../models/Blog');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user
      const adminUser = await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@connectdigitals.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
        isActive: true,
        isEmailVerified: true
      });
      console.log('✅ Admin user created:', adminUser.email);
    }

    // Check if blog posts already exist
    const existingPosts = await Blog.countDocuments();
    if (existingPosts > 0) {
      console.log(`✅ ${existingPosts} blog posts already exist`);
      return;
    }

    // Get admin user for blog posts
    const adminUser = await User.findOne({ role: 'admin' });

    // Sample blog posts data
    const blogPosts = [
      {
        title: 'The Power of Visual Balance in Graphic Design',
        excerpt: 'Discover how achieving perfect balance in your designs can create harmony and guide the viewer\'s eye effectively.',
        content: `Visual balance is one of the fundamental principles of graphic design that can make or break your compositions. It's the distribution of visual weight within a design that creates a sense of equilibrium and harmony.

When elements are properly balanced, viewers feel comfortable and can easily navigate through your design. There are several types of balance to consider:

**Symmetrical Balance**
This occurs when elements are mirrored on either side of a central axis. It creates a formal, stable, and organized appearance. Think of a logo with equal elements on both sides.

**Asymmetrical Balance**
This involves different elements that have equal visual weight but are not identical. It's more dynamic and interesting than symmetrical balance, creating visual tension and movement.

**Radial Balance**
Elements radiate from a central point, like spokes on a wheel. This creates a strong focal point and is often used in logos and circular designs.

**Tips for Achieving Balance:**
- Use the rule of thirds to position key elements
- Consider the visual weight of colors, shapes, and textures
- Balance large elements with multiple smaller ones
- Use white space strategically to create breathing room

Remember, balance doesn't always mean perfect symmetry. Sometimes the most compelling designs intentionally break traditional balance rules to create tension and interest.`,
        category: 'Graphic Design',
        tags: ['balance', 'composition', 'design principles', 'visual harmony'],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
          alt: 'Balanced geometric composition'
        },
        status: 'published',
        isFeatured: true,
        author: adminUser._id,
        authorName: adminUser.name
      },
      {
        title: 'Color Theory: Creating Emotional Connections',
        excerpt: 'Learn how to use color psychology to evoke specific emotions and create stronger connections with your audience.',
        content: `Color is one of the most powerful tools in a designer's arsenal. It can evoke emotions, convey messages, and create lasting impressions. Understanding color theory is essential for creating effective designs that resonate with your audience.

**The Color Wheel**
The color wheel is the foundation of color theory. It shows the relationships between primary, secondary, and tertiary colors. Understanding these relationships helps you create harmonious color schemes.

**Color Psychology**
Different colors evoke different emotions:
- **Red**: Energy, passion, urgency
- **Blue**: Trust, stability, professionalism
- **Green**: Growth, nature, health
- **Yellow**: Optimism, creativity, warmth
- **Purple**: Luxury, creativity, mystery
- **Orange**: Enthusiasm, adventure, confidence

**Color Schemes**
- **Monochromatic**: Different shades of the same color
- **Analogous**: Colors next to each other on the color wheel
- **Complementary**: Colors opposite each other on the color wheel
- **Triadic**: Three colors equally spaced on the color wheel

**Practical Applications**
When choosing colors for your designs:
1. Consider your brand personality
2. Think about your target audience
3. Ensure sufficient contrast for readability
4. Test colors in different lighting conditions
5. Consider cultural color associations

Remember, color choices should always serve your design's purpose and enhance the user experience.`,
        category: 'Color Theory',
        tags: ['color psychology', 'branding', 'emotions', 'design'],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
          alt: 'Colorful paint palette'
        },
        status: 'published',
        isFeatured: true,
        author: adminUser._id,
        authorName: adminUser.name
      },
      {
        title: 'Typography: The Art of Lettering',
        excerpt: 'Master the fundamentals of typography to create readable, beautiful, and effective text-based designs.',
        content: `Typography is more than just choosing fonts—it's the art and technique of arranging type to make written language legible, readable, and appealing. Good typography enhances the user experience and communicates your message effectively.

**Typeface vs Font**
- **Typeface**: The design of the letterforms (e.g., Helvetica, Times New Roman)
- **Font**: A specific size and weight of a typeface (e.g., Helvetica Bold 12pt)

**Font Categories**
- **Serif**: Traditional, formal, trustworthy (Times New Roman, Georgia)
- **Sans-serif**: Modern, clean, minimal (Helvetica, Arial)
- **Script**: Elegant, personal, creative (Brush Script, Pacifico)
- **Display**: Decorative, attention-grabbing (Impact, Comic Sans)

**Typography Principles**
1. **Hierarchy**: Use different sizes, weights, and styles to create visual hierarchy
2. **Contrast**: Ensure sufficient contrast between text and background
3. **Alignment**: Choose consistent alignment (left, right, center, justified)
4. **Spacing**: Use proper line height, letter spacing, and word spacing
5. **Consistency**: Use a limited number of fonts consistently throughout your design

**Best Practices**
- Limit your font choices to 2-3 typefaces per project
- Ensure readability at all sizes
- Consider the context and medium
- Test your typography on different devices
- Pay attention to cultural considerations

Typography is a crucial element that can make or break your design. Take the time to learn and practice these principles to create more effective and beautiful designs.`,
        category: 'Typography',
        tags: ['typography', 'fonts', 'readability', 'design principles'],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
          alt: 'Typography and lettering'
        },
        status: 'published',
        isFeatured: false,
        author: adminUser._id,
        authorName: adminUser.name
      },
      {
        title: 'Brand Identity: Beyond the Logo',
        excerpt: 'Explore how to create a comprehensive brand identity that goes far beyond just a logo design.',
        content: `A strong brand identity is more than just a logo—it's the complete visual and emotional representation of your brand. It encompasses everything from your logo and color palette to your tone of voice and customer experience.

**Elements of Brand Identity**
1. **Logo**: The visual symbol of your brand
2. **Color Palette**: Consistent colors that represent your brand
3. **Typography**: Fonts that reflect your brand personality
4. **Imagery**: Photography and illustration styles
5. **Voice and Tone**: How your brand communicates
6. **Brand Guidelines**: Rules for consistent application

**Creating a Brand Identity**
1. **Research**: Understand your target audience and competitors
2. **Define**: Establish your brand values, mission, and personality
3. **Design**: Create visual elements that reflect your brand
4. **Document**: Create comprehensive brand guidelines
5. **Implement**: Apply consistently across all touchpoints

**Brand Guidelines Should Include**
- Logo usage rules and variations
- Color specifications and usage
- Typography hierarchy and rules
- Imagery style and photography guidelines
- Voice and tone guidelines
- Application examples

**Consistency is Key**
Your brand identity should be consistent across:
- Website and digital platforms
- Print materials and packaging
- Social media presence
- Customer service interactions
- Physical locations (if applicable)

Remember, your brand identity is what sets you apart from competitors and creates recognition and trust with your audience.`,
        category: 'Branding',
        tags: ['brand identity', 'logo design', 'brand guidelines', 'marketing'],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
          alt: 'Brand identity elements'
        },
        status: 'published',
        isFeatured: false,
        author: adminUser._id,
        authorName: adminUser.name
      },
      {
        title: 'Social Media Design: Engaging Visual Content',
        excerpt: 'Learn how to create compelling social media graphics that capture attention and drive engagement.',
        content: `Social media has become a crucial platform for brands to connect with their audience. Creating engaging visual content is essential for standing out in crowded feeds and driving meaningful engagement.

**Platform-Specific Considerations**
Each social media platform has different requirements and best practices:

**Instagram**
- Square (1:1) or vertical (4:5) formats work best
- Use high-quality, visually appealing images
- Incorporate your brand colors and style
- Consider Stories and Reels for additional content

**Facebook**
- Horizontal images (1.91:1) perform well
- Include text overlays for better engagement
- Use clear, readable fonts
- Test different post types (images, videos, carousels)

**Twitter**
- Keep designs simple and readable at small sizes
- Use bold colors and clear typography
- Consider the fast-paced nature of the platform

**LinkedIn**
- Professional, clean designs
- Focus on business value and insights
- Use professional color schemes
- Include data and statistics when relevant

**Design Tips for Social Media**
1. **Consistency**: Maintain your brand identity across all platforms
2. **Simplicity**: Keep designs clean and uncluttered
3. **Readability**: Ensure text is legible at all sizes
4. **Call-to-Action**: Include clear CTAs when appropriate
5. **Testing**: A/B test different designs to see what works

**Tools and Resources**
- Canva, Figma, or Adobe Creative Suite for design
- Unsplash, Pexels for stock photos
- Brand guidelines for consistency
- Analytics tools to measure performance

Remember, social media design is about creating content that resonates with your audience and encourages interaction.`,
        category: 'Social Media',
        tags: ['social media', 'visual content', 'engagement', 'marketing'],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=600&fit=crop',
          alt: 'Social media design elements'
        },
        status: 'published',
        isFeatured: false,
        author: adminUser._id,
        authorName: adminUser.name
      },
      {
        title: 'Web Design Principles for Better UX',
        excerpt: 'Discover the key principles of web design that create better user experiences and drive conversions.',
        content: `Web design is about creating digital experiences that are not only visually appealing but also functional, accessible, and user-friendly. Good web design principles lead to better user experiences and higher conversion rates.

**Core Web Design Principles**

**1. User-Centered Design**
- Design for your users, not yourself
- Conduct user research and testing
- Create user personas and journey maps
- Prioritize user needs and goals

**2. Visual Hierarchy**
- Use size, color, and spacing to guide users
- Make important elements stand out
- Create clear information architecture
- Use consistent visual patterns

**3. Responsive Design**
- Ensure your site works on all devices
- Use flexible grids and layouts
- Optimize images for different screen sizes
- Test on various devices and browsers

**4. Accessibility**
- Follow WCAG guidelines
- Use proper contrast ratios
- Include alt text for images
- Ensure keyboard navigation
- Use semantic HTML

**5. Performance**
- Optimize images and assets
- Minimize HTTP requests
- Use efficient coding practices
- Monitor loading times

**Best Practices**
- Keep designs clean and uncluttered
- Use whitespace effectively
- Ensure fast loading times
- Make navigation intuitive
- Include clear calls-to-action
- Test regularly with real users

**Tools and Technologies**
- Design tools: Figma, Sketch, Adobe XD
- Development: HTML, CSS, JavaScript
- Testing: Browser dev tools, Lighthouse
- Analytics: Google Analytics, Hotjar

Remember, great web design is about creating experiences that users love and that achieve your business goals.`,
        category: 'Web Design',
        tags: ['web design', 'UX', 'user experience', 'responsive design'],
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
          alt: 'Web design and development'
        },
        status: 'published',
        isFeatured: false,
        author: adminUser._id,
        authorName: adminUser.name
      }
    ];

    // Create blog posts
    for (const postData of blogPosts) {
      await Blog.create(postData);
    }

    console.log(`✅ Created ${blogPosts.length} sample blog posts`);
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = seedData; 