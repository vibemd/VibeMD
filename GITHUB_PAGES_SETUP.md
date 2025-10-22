# GitHub Pages Setup Guide

This guide will help you enable and configure GitHub Pages for the VibeMD website.

## Quick Setup (One-Time Configuration)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/vibemd/VibeMD

2. Click **Settings** (top navigation)

3. In the left sidebar, click **Pages** (under "Code and automation")

4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions" (not "Deploy from a branch")

5. Click **Save** (if prompted)

That's it! The workflow will handle everything else.

### Step 2: Verify Deployment

After pushing code that changes the `site/` folder:

1. Go to **Actions** tab in your repository

2. You should see a workflow run called "Deploy GitHub Pages"

3. Wait for it to complete (usually 1-2 minutes)

4. Once complete, your site will be live at:
   ```
   https://vibemd.github.io/VibeMD/
   ```

## How It Works

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/pages.yml`) automatically deploys when:
- You push changes to the `main` branch that affect the `site/` folder
- You manually trigger the workflow from the Actions tab

### What Gets Deployed

The entire contents of the `site/` folder:
- `index.html` - Main website page
- `Screenshot.png` - App screenshot
- `icon.png` - Favicon and logo
- `logo.png` - Header logo
- Any other assets you add

### Workflow Process

1. **Trigger**: Push to main or manual dispatch
2. **Checkout**: Gets your code from repository
3. **Setup Pages**: Configures GitHub Pages environment
4. **Upload**: Uploads the `site/` folder as an artifact
5. **Deploy**: Deploys to GitHub Pages
6. **Live**: Your site is now accessible at the URL

## Custom Domain (Optional)

If you want to use a custom domain (e.g., `www.vibemd.app`):

### Option 1: Using GitHub Settings

1. In **Settings → Pages**
2. Under **Custom domain**, enter: `www.vibemd.app`
3. Click **Save**
4. GitHub will create a `CNAME` file automatically

### Option 2: Manual CNAME File

Create `site/CNAME` with your domain:
```
www.vibemd.app
```

### DNS Configuration

Add these DNS records with your domain provider:

**For www subdomain:**
```
Type: CNAME
Name: www
Value: vibemd.github.io
```

**For apex domain (vibemd.app):**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### HTTPS (SSL)

1. After DNS propagates (24-48 hours)
2. Go to **Settings → Pages**
3. Check **Enforce HTTPS**

## Troubleshooting

### Workflow Fails

**Error: "Permissions" or "token"**
- Go to **Settings → Actions → General**
- Scroll to **Workflow permissions**
- Select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"
- Click **Save**

**Error: "pages: write permission"**
- The workflow already has the correct permissions
- This usually resolves after the first successful run

### Site Not Updating

1. Check the **Actions** tab for errors
2. Verify the workflow completed successfully (green checkmark)
3. Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+F5)
4. Wait a few minutes - GitHub Pages can take 1-2 minutes to update

### 404 Error

**If you see a 404 at `https://vibemd.github.io/VibeMD/`:**

1. Verify GitHub Pages is enabled in Settings → Pages
2. Check that Source is set to "GitHub Actions"
3. Ensure at least one workflow has run successfully
4. The site should appear within 2-3 minutes of first deployment

### Images Not Loading

- Verify images are in the `site/` folder
- Check that filenames match exactly (case-sensitive)
- Look at browser console for 404 errors

## Maintenance

### Updating the Website

1. Edit files in the `site/` folder
2. Commit and push to main
3. GitHub Actions automatically deploys
4. Changes are live in 1-2 minutes

### Manual Deployment

You can manually trigger deployment:

1. Go to **Actions** tab
2. Click **Deploy GitHub Pages** workflow
3. Click **Run workflow** button
4. Select branch (main)
5. Click **Run workflow**

## Testing Locally

Before pushing, test your site locally:

```bash
# Navigate to site folder
cd site

# Start a simple HTTP server
python3 -m http.server 8000

# Or using Node.js
npx serve .
```

Open browser to: `http://localhost:8000`

## Current Website URL

Once enabled, your site will be available at:

**🌐 https://vibemd.github.io/VibeMD/**

(Or your custom domain if configured)

## Next Steps

After GitHub Pages is enabled:

1. ✅ Website automatically deploys from `site/` folder
2. ✅ Updates happen automatically on push to main
3. ✅ Share the URL in your README and documentation
4. ✅ Optionally configure custom domain

## Support

If you encounter issues:
- Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- Review workflow logs in Actions tab
- Ensure repository is public (or has GitHub Pro for private repos with Pages)

---

**Website Status:** Ready to deploy! Just enable GitHub Pages in Settings → Pages → Source: "GitHub Actions"
