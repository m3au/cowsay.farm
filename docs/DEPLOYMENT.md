# Deploying to Namecheap

This guide will help you deploy your Astro website to Namecheap hosting.

## Prerequisites

- Domain `cowsay.farm` registered at Namecheap
- Namecheap hosting account (Shared Hosting, VPS, or similar)
- FTP credentials or cPanel access from Namecheap

## Step 1: Build Your Website

First, build your Astro site to generate static files:

```bash
# Install dependencies (if not already done)
bun install

# Build the site
bun run build
```

This will create a `dist/` folder containing all the static files needed for your website.

## Step 2: Get Your Hosting Credentials

1. Log in to your Namecheap account
2. Go to **Hosting List** → Select your hosting account
3. Find your **SFTP/SSH credentials** or access **cPanel**

You'll need:

- SFTP Host (usually `yourdomain.com` or an IP address)
- SFTP Username
- SFTP Password (or SSH key for rsync method)
- Port: 22 for SFTP/SSH (avoid old FTP on port 21 - it's insecure)

## Step 3: Upload Files to Namecheap

### Option A: Using cPanel File Manager (Easiest)

1. Log in to **cPanel** from your Namecheap hosting dashboard
2. Open **File Manager**
3. Navigate to `public_html` folder (this is your website root)
4. Delete any default files (like `index.html` if present)
5. Upload all files from your local `dist/` folder:
   - Select all files in `dist/`
   - Upload them to `public_html`
   - Make sure the structure is: `public_html/index.html`, `public_html/about/`, etc.

### Option B: Using SFTP Client (Recommended for large sites)

1. Use an SFTP/SSH client like:

   - **FileZilla** (free, cross-platform) - use SFTP protocol
   - **Cyberduck** (free, Mac/Windows) - use SFTP protocol
   - **VS Code SFTP extension** (if you prefer staying in your editor)
   - **rsync** (command-line, most efficient)

2. Connect using your SFTP credentials:

   - Host: Your SFTP hostname
   - Username: Your SFTP username
   - Password: Your SFTP password
   - Port: **22** (SFTP/SSH - secure and modern)
   - Protocol: **SFTP** (not FTP - FTP is insecure)

3. Navigate to `public_html` on the server
4. Upload all contents from your local `dist/` folder to `public_html`

**Note:** Always use SFTP (port 22) instead of FTP (port 21). FTP sends passwords in plain text and is insecure.

**Important:** Upload the _contents_ of `dist/`, not the `dist` folder itself. So `dist/index.html` should become `public_html/index.html`.

## Step 4: Configure DNS (if needed)

If your domain isn't already pointing to your hosting:

1. In Namecheap, go to **Domain List** → **Manage** for `cowsay.farm`
2. Go to **Advanced DNS** tab
3. Set up A Record or CNAME:
   - **A Record**: Point `@` to your hosting IP address
   - **CNAME**: Point `www` to your hosting hostname
4. Wait for DNS propagation (can take up to 48 hours, usually much faster)

If you're using Namecheap hosting for the same domain, DNS is usually configured automatically.

## Step 5: Verify Your Site

1. Visit `https://cowsay.farm` in your browser
2. Check that all pages load correctly
3. Test navigation and functionality

## Troubleshooting

### Site shows "Index of /" or directory listing

- Make sure `index.html` is in the `public_html` root folder
- Check file permissions (should be 644 for files, 755 for folders)

### 404 errors on pages

- Ensure you uploaded all files from `dist/`, including subdirectories
- Check that `.htaccess` file is present (if Astro generated one)
- Verify file paths are correct

### CSS/JS not loading

- Check that all assets were uploaded
- Verify file permissions
- Clear browser cache

### SSL/HTTPS not working

- Namecheap provides free SSL certificates via cPanel
- Go to cPanel → **SSL/TLS Status** → Install SSL certificate
- Or use **AutoSSL** which automatically provisions certificates

## Future Updates

When you make changes to your site:

1. Make your code changes
2. Run `bun run build` again
3. Upload the new `dist/` contents to `public_html` (overwrite existing files)
4. Clear any CDN/cache if applicable

## Automated Deployment with GitHub Actions

This repository includes GitHub Actions workflows that automatically build and deploy your site whenever you push to the `main` or `master` branch.

### Option 1: SFTP Deployment (Recommended for Namecheap)

Uses secure SFTP (SSH-based file transfer) instead of old FTP.

**Setup Instructions:**

1. **Get your SFTP credentials from Namecheap:**

   - Log in to Namecheap → **Hosting List** → Select your hosting
   - Find your SFTP/SSH server, username, and password
   - Port is usually 22 for SFTP

2. **Add GitHub Secrets:**

   - Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret** and add:
     - `SFTP_SERVER`: Your SFTP hostname (e.g., `yourdomain.com` or IP address)
     - `SFTP_USERNAME`: Your SFTP username
     - `SFTP_PASSWORD`: Your SFTP password

3. **Push to trigger deployment:**
   - Workflow: `.github/workflows/deploy.yml`
   - Automatically runs on push to `main` or `master`
   - Or manually trigger from **Actions** tab

### Option 2: rsync over SSH (Most Modern & Efficient)

Uses rsync over SSH for faster, more efficient deployments. Requires SSH key authentication.

**Setup Instructions:**

1. **Generate SSH key pair** (if you don't have one):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions"
   ```

2. **Add public key to Namecheap server:**

   - Copy your public key (`~/.ssh/id_ed25519.pub`)
   - Add it to `~/.ssh/authorized_keys` on your Namecheap server
   - Or use cPanel → **SSH Access** → **Manage SSH Keys**

3. **Add GitHub Secrets:**

   - `SSH_PRIVATE_KEY`: Your private SSH key (the entire content of `~/.ssh/id_ed25519`)
   - `SSH_USER`: Your SSH username
   - `SSH_HOST`: Your server hostname or IP

4. **Enable the workflow:**
   - Rename `.github/workflows/deploy-rsync.yml` to `deploy.yml` (or keep both)
   - Or disable the SFTP workflow if you prefer rsync

**Why rsync?**

- ✅ Only transfers changed files (much faster)
- ✅ More secure (SSH key authentication)
- ✅ Better for large sites
- ✅ Atomic deployments with `--delete` flag

### How It Works

1. When you push code, GitHub Actions:

   - Checks out your code
   - Installs dependencies with Bun
   - Builds your Astro site
   - Deploys the `dist/` folder to `public_html/` via SFTP or rsync

2. **Monitor deployments:**
   - Go to the **Actions** tab in your GitHub repository
   - You'll see the deployment status and logs

### Troubleshooting GitHub Actions

- **Workflow fails:** Check the Actions logs for error messages
- **SFTP/SSH connection fails:** Verify your credentials in GitHub Secrets
- **Files not updating:** Ensure the workflow completed successfully and check file permissions on the server
- **rsync permission denied:** Verify your SSH key is added to the server's `authorized_keys`

## Alternative Deployment Methods

For other deployment options, consider:

- **Namecheap's Git integration** (if available on your plan)
- **Manual FTP upload** (see Step 3 above)
- **Other CI/CD services** like GitLab CI, CircleCI, etc.

## Need Help?

- Namecheap Support: <https://www.namecheap.com/support/>
- Astro Deployment Docs: <https://docs.astro.build/en/guides/deploy/>
