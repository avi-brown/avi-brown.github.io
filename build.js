const fs = require('fs');
const journalText = fs.readFileSync('journal.txt', 'utf8');
const posts = journalText.split('---').map(post => post.trim()).filter(post => post.length > 0).map((post, index) => {
    const lines = post.split('\n').filter(line => line.trim());
    const title = lines[0] || `Entry ${index + 1}`;
    const content = lines.slice(1).join('\n');
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return { title, content, date };
});
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avi's Journal</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.6; color: #333; background: #fff; }
        h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
        .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
        .entry { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #eee; }
        .entry:last-child { border-bottom: none; }
        .entry-title { color: #34495e; margin-bottom: 0.5rem; }
        .entry-date { color: #7f8c8d; font-size: 0.85rem; margin-bottom: 1rem; }
        .entry-content { white-space: pre-wrap; }
        .back-link { color: #3498db; text-decoration: none; font-size: 0.9rem; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <header>
        <h1>Avi's Journal</h1>
        <div class="meta"><a href="https://avi.engineer" class="back-link">← Back to main site</a></div>
    </header>
    <main>
        ${posts.map(post => `<article class="entry"><h2 class="entry-title">${post.title}</h2><div class="entry-date">${post.date}</div><div class="entry-content">${post.content}</div></article>`).join('')}
    </main>
</body>
</html>`;
fs.writeFileSync('index.html', html);
console.log(`Generated journal with ${posts.length} posts`);
