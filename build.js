const fs = require('fs');
const journalText = fs.readFileSync('journal.txt', 'utf8');
const posts = journalText.split('---').map(post => post.trim()).filter(post => post.length > 0).map((post, index) => {
   const lines = post.split('\n').filter(line => line.trim());
   
   // Check for date line and title
   let dateValue = '';
   let title = `Entry ${index + 1}`;
   let contentStartIndex = 0;
   
   // If first line starts with date:
   if (lines.length > 0 && lines[0].startsWith('date:')) {
       dateValue = lines[0].substring(5).trim().toLowerCase();
       
       // Find the next non-empty line for title
       for (let i = 1; i < lines.length; i++) {
           if (lines[i].trim()) {
               title = lines[i];
               contentStartIndex = i + 1;
               break;
           }
       }
   } 
   // If second line starts with date:
   else if (lines.length > 1 && lines[1].startsWith('date:')) {
       title = lines[0];
       dateValue = lines[1].substring(5).trim().toLowerCase();
       contentStartIndex = 2;
   }
   // No date line
   else if (lines.length > 0) {
       title = lines[0];
       contentStartIndex = 1;
   }
   
   // Get content (everything after title and date)
   let content = lines.slice(contentStartIndex).join('\n');
   
   // Strip ANSI color codes and other control sequences
   content = content.replace(/\u001b\[[0-9;]*[a-zA-Z]|\u001b\([0-9A-Z]|\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]|\(B\[m|\(B/g, '');
   
   // Process images
   content = content.replace(/@imgs\/([^\s]+\.(jpg|jpeg|png|gif|webp))(\s--(small|medium|large))?/gi, (match, filename, ext, sizeMatch, size) => {
       const imageSize = size || 'medium';
       return `<img src="imgs/${filename}" class="img-${imageSize}" alt="${filename}">`;
   });
   
   // Process markdown links
   content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
   
   return { title, content, date: dateValue };
});
const html = `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>avi's μblog</title>
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
       * { box-sizing: border-box; text-align: left; }
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
           margin-bottom: calc(var(--spacing) * 2);
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
           border-bottom: 1px solid rgba(0, 0, 0, 0.1); 
       }
       .entry-summary { 
           cursor: pointer; 
           display: flex; 
           justify-content: space-between; 
           align-items: baseline; 
       }
       .entry-toggle { 
           font-size: 1rem; 
           opacity: 0.7; 
       }
       .entry-title { margin: 0; }
       .entry-date { 
           opacity: 0.5; 
           font-size: 1rem; 
           margin-top: calc(var(--spacing) / 2);
           margin-bottom: calc(var(--spacing) / 2);
       }
       .entry-content { 
           white-space: pre-line; 
           font-size: 1.3rem;
           display: none; 
       }
       .entry-content.open { display: block; }
       .img-small { max-width: 200px; }
       .img-medium { max-width: 400px; }
       .img-large { max-width: 100%; }
       img { 
           display: block; 
           height: auto; 
           margin: var(--spacing) 0; 
           border-radius: 4px; 
       }
       a { 
           color: currentColor; 
           text-decoration-color: var(--color-primary); 
           text-decoration-thickness: 0.2ex; 
           text-underline-offset: 0.3ex; 
       }
       a:hover { text-decoration-thickness: 0.3ex; }
       .banner-container {
           width: 100%;
           margin-bottom: var(--spacing);
           overflow: hidden;
       }
       .banner-image {
           width: 100%;
           height: auto;
           object-fit: cover;
           border-radius: 4px;
       }
       .title-divider {
           border: 0;
           height: 1px;
           background-color: var(--color-primary);
           margin-top: calc(var(--spacing) * -1);
           margin-bottom: calc(var(--spacing) * 2);
           opacity: 0.5;
       }
       .collapse-all {
           cursor: pointer;
           font-size: 1rem;
           opacity: 0.7;
           text-decoration: underline;
           text-decoration-color: var(--color-primary);
           text-decoration-thickness: 0.2ex;
           text-underline-offset: 0.3ex;
           display: block;
           position: fixed;
           right: 2rem;
           top: 2rem;
           background-color: var(--color-light);
           padding: 0.5rem 1rem;
           border-radius: 4px;
           box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
           z-index: 100;
       }
       .collapse-all:hover { 
           text-decoration-thickness: 0.3ex;
           opacity: 1;
       }
   </style>
</head>
<body>
   <header>
       <div class="nav"><a href="https://avi.engineer" class="home-link">avi.engineer</a></div>
       <div class="banner-container">
           <img src="imgs/banner.jpeg" alt="Banner" class="banner-image">
       </div>
       <h1>avi brown's μblog</h1>
       <hr class="title-divider">
   </header>
   <div class="collapse-all" onclick="collapseAll()">collapse all</div>
   <main>
       ${posts.map(post => `
       <article class="entry">
           <div class="entry-summary" onclick="toggleEntry(this)">
               <h2 class="entry-title">${post.title}</h2>
               <span class="entry-toggle">+</span>
           </div>
           <div class="entry-content">
               <div class="entry-date">${post.date}</div>
               ${post.content}
           </div>
       </article>
       `).join('')}
   </main>
   <script>
       function toggleEntry(summary) {
           const content = summary.parentNode.querySelector('.entry-content');
           const toggle = summary.querySelector('.entry-toggle');
           if (content.classList.contains('open')) {
               content.classList.remove('open');
               toggle.textContent = '+';
           } else {
               content.classList.add('open');
               toggle.textContent = '−';
           }
       }
       
       function collapseAll() {
           const openContents = document.querySelectorAll('.entry-content.open');
           openContents.forEach(content => {
               content.classList.remove('open');
               const summary = content.parentNode.querySelector('.entry-summary');
               const toggle = summary.querySelector('.entry-toggle');
               toggle.textContent = '+';
           });
       }
   </script>
</body>
</html>`;
fs.writeFileSync('index.html', html);
console.log(`Generated journal with ${posts.length} posts`);
