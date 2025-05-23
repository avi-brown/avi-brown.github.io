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
    <title>avi brown's μblog</title>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap");
        :root {
            --color-dark: #1a1a1a;
            --color-light: #fafafa;
            --color-primary: #008080;
            --spacing: 1.5rem;
            --font-stack: "IBM Plex Mono", monospace;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --color-dark: #fafafa;
                --color-light: #1a1a1a;
            }
        }
        * { box-sizing: border-box; }
        body { 
            background: var(--color-light); 
            color: var(--color-dark); 
            padding: 5vw; 
            font-family: var(--font-stack); 
            font-size: 1.5rem; 
            line-height: 1.7; 
            max-width: 60ch; 
            margin: 0 auto; 
        }
        h1 { 
            font-weight: 700; 
            font-size: 2rem; 
            line-height: 1.3; 
            margin-bottom: calc(var(--spacing) / 2);
        }
        h2 { 
            font-weight: 700; 
            font-size: 1.5rem; 
            line-height: 1.3; 
            margin-bottom: calc(var(--spacing) / 2);
        }
        .nav { margin-bottom: var(--spacing); }
        .home-link { 
            color: currentColor; 
            text-decoration-color: var(--color-primary); 
            text-decoration-thickness: 0.2ex; 
            text-underline-offset: 0.3ex; 
        }
        .home-link:hover { text-decoration-thickness: 0.3ex; }
        .entry { 
            margin-bottom: calc(var(--spacing) * 2); 
            padding-bottom: var(--spacing); 
        }
        .entry:not(:last-child) { 
            border-bottom: 1px solid rgba(0, 0, 0, 0.1); 
        }
        .entry-title { margin-bottom: calc(var(--spacing) / 3); }
        .entry-date { 
            opacity: 0.5; 
            font-size: 1rem; 
            margin-bottom: var(--spacing); 
        }
        .entry-content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <header>
        <div class="nav"><a href="https://avi.engineer" class="home-link">home</a></div>
        <h1>avi brown's μblog</h1>
    </header>
    <main>
        ${posts.map(post => `<article class="entry"><h2 class="entry-title">${post.title}</h2><div class="entry-date">${post.date}</div><div class="entry-content">${post.content}</div></article>`).join('')}
    </main>
</body>
</html>`;
fs.writeFileSync('index.html', html);
console.log(`Generated journal with ${posts.length} posts`);