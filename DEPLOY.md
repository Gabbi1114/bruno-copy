# CI/CD Deployment Guide

This project uses **GitHub Actions** to automatically build and deploy the 3D portfolio whenever you push to `main`.

## How It Works

```
You push code → GitHub Actions runs → Builds the app → Deploys to GitHub Pages
```

### The workflow (`.github/workflows/deploy.yml`)

1. **Trigger**: Runs on every push to `main`, or when you click "Run workflow" in the Actions tab
2. **Build job**:
   - Checks out your code
   - Installs Node.js 20
   - Runs `npm install --force`
   - Runs `npm run build -- --base /bruno-copy/` (builds for subdirectory)
   - Uploads the `dist/` folder as an artifact
3. **Deploy job**:
   - Takes the built files and deploys them to GitHub Pages

## One-Time Setup

### 1. Enable GitHub Pages

1. Go to your repo: **https://github.com/Gabbi1114/bruno-copy**
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**

That's it. GitHub will now use the workflow to deploy.

### 2. Push the workflow

The workflow file is in `.github/workflows/deploy.yml`. Push it to your repo:

```powershell
cd "c:\Users\utaat\OneDrive\Desktop\Bruno-simon\folio-2025-fresh"
git add .github/
git commit -m "Add CI/CD deployment workflow"
git push bruno-copy main
```

### 3. First deployment

After you push, the workflow runs automatically. Check the **Actions** tab to see progress.

- **Live URL**: https://gabbi1114.github.io/bruno-copy/

## Custom Domain (56moments.store)

If you want the site at `56moments.store/bruno-copy/` instead of `gabbi1114.github.io/bruno-copy/`:

1. In **Settings** → **Pages**, set **Custom domain** to your domain
2. Configure your DNS to point to GitHub Pages (see [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))
3. If the site lives at a subdirectory like `/bruno-copy/`, the `--base /bruno-copy/` in the workflow is already correct

## Manual Deploy

To trigger a deploy without pushing code:

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

## Why the copy had more errors than the original

The original bruno-simon.com and your copy use the same code, but deployment and environment differ:

| Issue | Cause | Fix applied |
|-------|-------|-------------|
| **"WebGL context was not allowed to start"** | Mobile browsers (Safari, etc.) require a user gesture before WebGL/WebGPU can start. The game was starting on load. | Added a "Tap to start" overlay so the game only starts after the user taps. |
| **createImageBitmap / "unsigned long" errors** | Safari has known issues with `createImageBitmap`. Can appear when WebGL init is blocked or during texture loading. | The user-gesture gate reduces these by ensuring WebGL starts only after a valid user interaction. |
| **Preload "not used" warnings** | Absolute paths (`/respawns/...`) broke when deployed to a subdirectory (`/bruno-copy/`). | Switched preload and asset links to relative paths (`./respawns/...`). |

The original site may appear to work better because it’s often tested on desktop (where the user-gesture rule is looser) or because of different hosting/CDN behavior.

## Troubleshooting

| Problem | Solution |
|--------|----------|
| Workflow fails on "Install dependencies" | Check the Actions log; you may need to adjust for peer dependency issues |
| 404 or blank page | Ensure GitHub Pages source is set to **GitHub Actions** |
| Wrong base path | Edit `deploy.yml` and change `--base /bruno-copy/` to match your URL |
| Build works locally but not in CI | Some native deps (e.g. `sharp`) may need extra setup on Linux; check the error log |
