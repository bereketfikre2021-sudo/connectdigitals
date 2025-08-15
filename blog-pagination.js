// Blog Pagination Functionality
function initBlogPagination() {
  const blogGrid = document.querySelector('.blog-grid');
  const prevBtn = document.querySelector('.blog-nav-btn.prev-btn');
  const nextBtn = document.querySelector('.blog-nav-btn.next-btn');
  const pageNumbers = document.querySelectorAll('.page-number');
  
  if (!blogGrid || !prevBtn || !nextBtn) {
    console.warn('Blog pagination elements not found');
    return;
  }

  const blogCards = Array.from(blogGrid.querySelectorAll('.blog-card'));
  const postsPerPage = 3;
  const totalPages = Math.ceil(blogCards.length / postsPerPage);
  let currentPage = 1;

  function showPage(page) {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    blogCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    pageNumbers.forEach((pageNum, index) => {
      if (index < totalPages) {
        if (index + 1 === page) {
          pageNum.classList.add('active');
        } else {
          pageNum.classList.remove('active');
        }
      }
    });

    currentPage = page;
    updateNavigationState();
  }

  function updateNavigationState() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  prevBtn.addEventListener('click', function() {
    if (currentPage > 1) {
      showPage(currentPage - 1);
    }
  });

  nextBtn.addEventListener('click', function() {
    if (currentPage < totalPages) {
      showPage(currentPage + 1);
    }
  });

  pageNumbers.forEach((pageNum, index) => {
    if (index < totalPages) {
      pageNum.addEventListener('click', function() {
        showPage(index + 1);
      });
    }
  });

  showPage(1);
  console.log('Blog pagination initialized');
}
