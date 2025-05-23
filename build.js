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
    <title>Avi Brown's μblog</title>
    <style>
        body { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; max-width: 800px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.6; color: #ebdbb2; background: #282828; }
        h1 { color: #fabd2f; border-bottom: 2px solid #504945; padding-bottom: 0.5rem; }
        .nav { margin-bottom: 2rem; }
        .home-link { color: #83a598; text-decoration: none; font-size: 0.9rem; }
        .home-link:hover { color: #8ec07c; text-decoration: underline; }
        .entry { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #504945; }
        .entry:last-child { border-bottom: none; }
        .entry-title { color: #fb4934; margin-bottom: 0.5rem; }
        .entry-date { color: #928374; font-size: 0.85rem; margin-bottom: 1rem; }
        .entry-content { white-space: pre-wrap; color: #ebdbb2; }
    </style>
</head>
<body>
    <header>
        <div class="nav"><a href="https://avi.engineer" class="home-link">home</a></div>
        <h1>Avi Brown's μblog</h1>
    </header>
    <main>
        ${posts.map(post => `<article class="entry"><h2 class="entry-title">${post.title}</h2><div class="entry-date">${post.date}</div><div class="entry-content">${post.content}</div></article>`).join('')}
    </main>
</body>
</html>`;
fs.writeFileSync('index.html', html);
console.log(`Generated journal with ${posts.length} posts`);