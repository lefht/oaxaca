// Function to load and display a post
function loadPost(url) {
  document.getElementById('post-content').innerHTML = '<div class="loading">Loading post...</div>';
  
  fetch(url)
    .then(res => res.text())
    .then(markdown => {
      const parts = markdown.split('---');
      const content = parts.slice(2).join('---');
      const htmlContent = marked.parse(content);
      
      document.getElementById('post-content').innerHTML = `
        <div class="post">
          ${htmlContent}
        </div>
      `;
    })
    .catch(error => {
      console.error('Error loading post:', error);
      document.getElementById('post-content').innerHTML = 'Error loading post content';
    });
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get all markdown posts from the posts directory
  fetch('/posts/')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const postLinks = Array.from(doc.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(href => href.endsWith('.md'))
        .map(href => `/posts/${href}`);

      // Process all posts
      return Promise.all(postLinks.map(url => 
        fetch(url)
          .then(res => res.text())
          .then(markdown => {
            const parts = markdown.split('---');
            const frontMatter = parts[1];
            
            // Extract metadata
            const filename = url.split('/').pop();
            const dateString = filename.split('-').slice(0,3).join('-');
            const postDate = new Date(dateString).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            // Extract title from front matter
            const titleMatch = frontMatter.match(/title:\s*"(.*)"/);
            const title = titleMatch ? titleMatch[1] : 'Untitled Post';

            return {
              date: postDate,
              title: title,
              url: url
            };
          })
      ));
    })
    .then(posts => {
      // Sort posts by date descending
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Render menu items
      const menu = document.getElementById('post-menu');
      menu.innerHTML = posts.map(post => `
        <li>
          <a href="#" onclick="loadPost('${post.url}'); return false;">
            ${post.date}: ${post.title}
          </a>
        </li>
      `).join('');

      // Load first post by default
      if (posts.length > 0) {
        loadPost(posts[0].url);
      }
    })
    .catch(error => {
      console.error('Error loading posts:', error);
      document.getElementById('post-content').innerHTML = 'Error loading blog posts';
    });
});
