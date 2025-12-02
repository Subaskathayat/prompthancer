# prompthancer
Enhance simple prompts into professional ready to use prompts

test text

for my quick access :

git add .
git commit -m "Fix"
git push origin main



Take my current static website (HTML + CSS + JS only) and turn it into a secure full-stack Node.js + Express app that deploys perfectly on Vercel.

Current project structure (all files are in the root right now):
- index.html
- app.html
- style.css
- app.js
- promptenhancer.js
- socialMediaPostGenerator.js
- favicon.ico, favicon-16x16.png, etc.
- folders: fonts/, icons/, images/
- robots.txt, sitemap.xml, README.md, etc.

Tasks you must complete:

1. Create the perfect folder structure with a separated frontend folder to move current frontend files.
2. Generate a complete server.js (Express) in the root that:
   - Serves all static files from /frontend
   - Has body-parser for JSON and forms
   - Includes a test route /api/hello that returns { success: true, message: "Backend is live!" }
   - Uses process.env.PORT for Vercel
   - Has a catch-all route (*) to serve index.html (SPA behavior)
3. Generate the exact vercel.json needed for a Node.js/Express app on Vercel.
4. Generate package.json with only the necessary dependencies (express) and a start script.
5. Give me the exact terminal commands to run locally to set everything up (mkdir, mv, npm init, npm install, etc.).
6. Add a .gitignore file that ignores node_modules and .env.
8. Make sure everything is 100% secure for production (no hardcoded secrets, safe headers, etc.).

After this, my site should work exactly as before, but now with a real backend running on the same Vercel domain.