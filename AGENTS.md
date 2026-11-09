# Repository Guide

- This is a dependency-free static site deployed only to GitHub Pages. Read [README.md](README.md) for local preview and deployment steps; there is no build or automated test command.
- Pages are standalone HTML files in the repository root. Shared styling and behavior live in [assets/styles.css](assets/styles.css) and [assets/main.js](assets/main.js).
- Navigation and footer markup are repeated across pages. Keep them consistent when editing; homepage layout is controlled by the shared stylesheet, not inline styles.
- URLs use root-relative paths for the custom domain. When adding or changing pages, check internal links and update [sitemap.xml](sitemap.xml) as needed.
- Contact links open the visitor's email client; there is no contact form or message backend. Do not describe the site as accepting messages directly.
- Treat legal and privacy-policy wording as owner-approved content. Avoid changing legal claims without flagging the change for owner or legal review.
- For UI changes, run `python3 -m http.server 8000` from the repository root and inspect affected pages at desktop and mobile widths. Check navigation, theme behavior, and any interactions touched; verify referenced assets and links.