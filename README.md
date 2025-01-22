# Static Blog Generator

A simple static blog generator that creates a minimalist blog similar to danluu.com.

## How it works

1. Place your markdown posts in the `posts` directory using the format: `YYYY-MM-DD-post-title.md`
2. Each post should have front matter with a title:
   ```markdown
   ---
   title: "Your Post Title"
   ---

   Your post content here...
   ```
3. The generator will:
   - Convert markdown posts to HTML
   - Create an index page with a chronological list of posts
   - Generate static HTML files ready for GitHub Pages

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate static files:
   ```bash
   node generate_posts.js
   ```

3. Preview locally:
   ```bash
   python3 -m http.server 8000
   ```

## GitHub Pages Deployment

1. Push your changes to the main branch
2. GitHub Actions will automatically:
   - Generate the static files
   - Deploy to GitHub Pages
3. Your blog will be available at: `https://[username].github.io/[repository-name]/`

Note: Make sure to enable GitHub Pages in your repository settings and set it to deploy from the gh-pages branch.
