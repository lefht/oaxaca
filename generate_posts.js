import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { marked } from 'marked';
import { join } from 'path';

// Read post template
const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
    }
    .post-header {
      margin-bottom: 30px;
    }
    .post-title {
      margin-bottom: 10px;
    }
    .post-date {
      color: #666;
      font-size: 0.9em;
    }
    .post-content img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <a href="/" class="back-link">← Back to Posts</a>
  <article>
    <div class="post-header">
      <h1 class="post-title">{{title}}</h1>
      <div class="post-date">{{date}}</div>
    </div>
    <div class="post-content">
      {{content}}
    </div>
  </article>
</body>
</html>`;

// Get all markdown files
const postsDir = './posts';
const posts = readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .map(filename => {
    const content = readFileSync(join(postsDir, filename), 'utf-8');
    const parts = content.split('---');
    const frontMatter = parts[1];
    const markdown = parts.slice(2).join('---');
    
    // Extract metadata
    const titleMatch = frontMatter.match(/title:\s*"(.*)"/);
    const title = titleMatch ? titleMatch[1] : 'Untitled Post';
    
    // Parse date from filename
    const dateStr = filename.split('-').slice(0,3).join('-');
    const date = new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate HTML
    const htmlContent = marked.parse(markdown);
    const htmlFilename = filename.replace('.md', '.html');
    
    // Create post HTML
    const postHtml = template
      .replace(/{{title}}/g, title)
      .replace(/{{date}}/g, date)
      .replace(/{{content}}/g, htmlContent);
    
    // Write post HTML file
    writeFileSync(join(postsDir, htmlFilename), postHtml);
    
    return {
      date: dateStr,
      displayDate: `${(new Date(dateStr).getMonth() + 1).toString().padStart(2, '0')}/${new Date(dateStr).getFullYear().toString().slice(2)}`,
      title,
      url: `/posts/${htmlFilename}`
    };
  });

// Sort posts by date
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate index page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Posts</title>
  <style>
    body {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
    }
    h1 {
      margin-bottom: 30px;
    }
    .post-list {
      list-style: none;
      padding: 0;
    }
    .post-item {
      display: flex;
      margin-bottom: 15px;
      align-items: baseline;
    }
    .post-date {
      width: 60px;
      color: #666;
      font-size: 0.9em;
      flex-shrink: 0;
    }
    .post-title {
      margin-left: 20px;
      text-decoration: none;
      color: #0066cc;
    }
    .post-title:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>Blog Posts</h1>
  <ul class="post-list">
    ${posts.map(post => `
      <li class="post-item">
        <span class="post-date">${post.displayDate}</span>
        <a class="post-title" href="${post.url}">${post.title}</a>
      </li>
    `).join('')}
  </ul>
</body>
</html>`;

writeFileSync('index.html', indexHtml);
