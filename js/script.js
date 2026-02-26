// ============================================
// 📄 SMART CV DOWNLOAD FUNCTION
// ============================================
async function handleCVDownload(event) {
  event.preventDefault();
  
  const cvPath = 'MohammadHaroonNadim.pdf';
  const btn = document.getElementById('cvDownloadBtn');
  const originalHTML = btn.innerHTML;
  
  // Show loading state
  btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Checking...';
  btn.style.pointerEvents = 'none';
  
  try {
    // Check if file exists using HEAD request
    const response = await fetch(cvPath, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    
    if (response.ok) {
      // File exists - trigger download
      const link = document.createElement('a');
      link.href = cvPath;
      link.download = 'MohammadHaroonNadim.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success
      btn.innerHTML = '<i class="bx bx-check"></i> Downloaded!';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = 'auto';
      }, 2000);
    } else {
      // File not found - redirect to 404
      window.location.href = '404.html';
    }
  } catch (error) {
    console.error('CV Download Error:', error);
    // On error, redirect to 404
    window.location.href = '404.html';
  }
}

// Attach CV download handler when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const cvBtn = document.getElementById('cvDownloadBtn');
  if (cvBtn) {
    cvBtn.addEventListener('click', handleCVDownload);
  }
});

// ============================================
// 📚 PAGE TURN FUNCTIONALITY
// ============================================
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
  el.onclick = (e) => {
    e.preventDefault();
    const pageTurnId = el.getAttribute('data-page');
    const pageTurn = document.getElementById(pageTurnId);

    if (pageTurn.classList.contains('turn')) {
      pageTurn.classList.remove('turn');
      setTimeout(() => {
        pageTurn.style.zIndex = 2 - index;
      }, 500);
    } else {
      pageTurn.classList.add('turn');
      setTimeout(() => {
        pageTurn.style.zIndex = 2 + index;
      }, 500);
    }
  };
});

// ============================================
// 💬 CONTACT ME BUTTON
// ============================================
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

if (contactMeBtn) {
  contactMeBtn.onclick = (e) => {
    e.preventDefault();
    pages.forEach((page, index) => {
      setTimeout(() => {
        page.classList.add('turn');
        setTimeout(() => {
          page.style.zIndex = 20 + index;
        }, 500);
      }, (index + 1) * 200 + 100);
    });
  };
}

// ============================================
// 🔄 REVERSE INDEX FUNCTION
// ============================================
let totalPages = pages.length;
let pageNumber = 0;

function reverseIndex() {
  pageNumber--;
  if (pageNumber < 0) {
    pageNumber = totalPages - 1;
  }
}

// ============================================
// 👤 BACK PROFILE BUTTON
// ============================================
const backProfileBtn = document.querySelector('.back-profile');

if (backProfileBtn) {
  backProfileBtn.onclick = (e) => {
    e.preventDefault();
    pages.forEach((_, index) => {
      setTimeout(() => {
        reverseIndex();
        pages[pageNumber].classList.remove('turn');
        setTimeout(() => {
          reverseIndex();
          pages[pageNumber].style.zIndex = 10 + index;
        }, 500);
      }, (index + 1) * 200 + 100);
    });
  };
}

// ============================================
// 📦 GITHUB REPOSITORIES
// ============================================
async function loadGitHubProjects(containerId, limit = 12) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch('https://api.github.com/users/mharoon2003/repos');
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    container.innerHTML = '';

    const sortedRepos = data
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, limit);

    updateGitHubStats(data);

    if (sortedRepos.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="bx bx-folder-open"></i>
          <h3>No repositories found</h3>
          <p>Check back later for updates!</p>
        </div>
      `;
      return;
    }

    sortedRepos.forEach((repo, index) => {
      const card = createProjectCard(repo, index);
      container.appendChild(card);
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    container.innerHTML = `
      <div class="error-state">
        <i class="bx bx-error-circle"></i>
        <h3>Unable to load projects</h3>
        <p>Please visit my <a href="https://github.com/mharoon2003" target="_blank">GitHub</a> directly.</p>
      </div>
    `;
  }
}

function updateGitHubStats(repos) {
  const repoCount = document.getElementById('repo-count');
  const totalStars = document.getElementById('total-stars');
  
  if (repoCount) animateValue(repoCount, 0, repos.length, 1000);
  
  if (totalStars) {
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    animateValue(totalStars, 0, stars, 1500);
  }
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  
  const timer = setInterval(() => {
    current += increment * Math.ceil(range / 20);
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = current;
  }, stepTime);
}

function createProjectCard(repo, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  const languageColor = getLanguageColor(repo.language);
  const topics = repo.topics ? repo.topics.slice(0, 5) : [];
  
  card.innerHTML = `
    <div class="project-header">
      <div>
        <h3 class="project-name">${repo.name}</h3>
        <span class="project-visibility">
          <i class="bx bx-${repo.private ? 'lock' : 'globe'}"></i>
          ${repo.private ? 'Private' : 'Public'}
        </span>
      </div>
    </div>
    
    <p class="project-description">
      ${repo.description || 'No description provided. Check out the repository to learn more!'}
    </p>
    
    <div class="project-meta">
      ${repo.language ? `
        <div class="project-language">
          <span class="language-dot" style="background: ${languageColor}; box-shadow: 0 0 8px ${languageColor}"></span>
          <span>${repo.language}</span>
        </div>
      ` : ''}
      
      <div class="project-stats">
        <div class="project-stat">
          <i class="bx bx-star"></i>
          <span>${repo.stargazers_count}</span>
        </div>
        <div class="project-stat">
          <i class="bx bx-git-fork"></i>
          <span>${repo.forks_count}</span>
        </div>
        ${repo.open_issues_count > 0 ? `
          <div class="project-stat">
            <i class="bx bx-error"></i>
            <span>${repo.open_issues_count}</span>
          </div>
        ` : ''}
      </div>
    </div>
    
    <div class="project-footer">
      <div class="project-topics">
        ${topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
      </div>
      
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
        <span>View Project</span>
        <i class="bx bx-link-external"></i>
      </a>
    </div>
  `;
  
  return card;
}

function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Dart': '#00B4AB',
    'PHP': '#4F5D95',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'Go': '#00ADD8',
    'Ruby': '#701516',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Shell': '#89e051',
    'Vue': '#41b883',
    'React': '#61dafb',
    'Flutter': '#02569B'
  };
  return colors[language] || '#858585';
}

// ============================================
// 🎬 OPENING ANIMATION
// ============================================
const coverRight = document.querySelector('.cover.cover-right');

if (coverRight) {
  setTimeout(() => coverRight.classList.add('turn'), 2100);
  setTimeout(() => { coverRight.style.zIndex = -1; }, 2800);
}

if (pages.length > 0) {
  pages.forEach((_, index) => {
    setTimeout(() => {
      reverseIndex();
      pages[pageNumber].classList.remove('turn');
      setTimeout(() => {
        reverseIndex();
        pages[pageNumber].style.zIndex = 10 + index;
      }, 500);
    }, (index + 1) * 200 + 2100);
  });
}

// ============================================
// 🌗 BB-8 THEME TOGGLE
// ============================================
const bb8Toggle = document.getElementById('bb8Toggle');

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    if (bb8Toggle) bb8Toggle.checked = true;
  } else {
    document.body.classList.remove('light');
    if (bb8Toggle) bb8Toggle.checked = false;
  }
}

function applyTheme(isLight) {
  if (isLight) {
    document.body.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }
}

loadTheme();

if (bb8Toggle) {
  bb8Toggle.addEventListener('change', (e) => {
    applyTheme(e.target.checked);
    pulseBookLight();
  });
}

function pulseBookLight() {
  const wrapper = document.querySelector('.wrapper');
  if (wrapper) {
    wrapper.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    wrapper.style.transform = 'scale(1.02)';
    setTimeout(() => {
      wrapper.style.transform = 'scale(1)';
    }, 300);
  }
}

// ============================================
// 🌸 FLOWER ANIMATION
// ============================================
function initFlowers() {
  document.querySelectorAll('.flower-container').forEach((el, index) => {
    el.innerHTML = `
      <div class="flower-top">
        <div class="flower-petal flower-petal__1"></div>
        <div class="flower-petal flower-petal__2"></div>
        <div class="flower-petal flower-petal__3"></div>
        <div class="flower-petal flower-petal__4"></div>
        <div class="flower-petal flower-petal__5"></div>
        <div class="flower-petal flower-petal__6"></div>
        <div class="flower-petal flower-petal__7"></div>
        <div class="flower-petal flower-petal__8"></div>
        <div class="flower-circle"></div>
        <div class="flower-light"></div>
        <div class="flower-light"></div>
        <div class="flower-light"></div>
        <div class="flower-light"></div>
      </div>
      <div class="flower-stem"></div>
      <div class="flower-leaf left"></div>
      <div class="flower-leaf right"></div>
      <div class="flower-leaf left"></div>
      <div class="flower-leaf right"></div>
    `;
    el.style.animationDelay = `${index * 0.3}s`;
  });

  setTimeout(() => {
    const flowers = document.querySelectorAll('.flower-container');
    flowers.forEach((flower, i) => {
      setTimeout(() => {
        flower.classList.add('animate');
        flower.style.opacity = '1';
      }, i * 400);
    });
  }, 1500);
}

if (document.querySelector('.flowers-wrapper')) {
  setTimeout(initFlowers, 2000);
}

// ============================================
// 🚀 INITIALIZE ON DOM LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('github-projects')) {
    loadGitHubProjects('github-projects', 3);
  }
  if (document.getElementById('all-projects')) {
    loadGitHubProjects('all-projects', 12);
  }
  
  // Attach CV download handler
  const cvBtn = document.getElementById('cvDownloadBtn');
  if (cvBtn) {
    cvBtn.addEventListener('click', handleCVDownload);
  }
});