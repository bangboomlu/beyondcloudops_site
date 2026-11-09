
# BeyondCloudOps

Dependency-free static website for home-network, smart-home, and homelab support.

## Local preview

Run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000/`. There is no build step or automated test command.

## Deployment

GitHub Pages is the only deployment target. In the repository's **Settings → Pages**, choose **Deploy from a branch**, select the branch containing the site and the `/(root)` folder. Keep the root `CNAME` file so GitHub Pages continues to use the configured custom domain.

## Project notes

- Pages are standalone HTML files in the repository root; shared styling and interactions are in `assets/styles.css` and `assets/main.js`.
- Contact links open the visitor's email client. There is no contact form or message backend.
- Theme colors are CSS variables, and the header button switches between light and dark themes.
