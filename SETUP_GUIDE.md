# Quick Setup Guide for GitHub Actions Deployment

## Step 1: Get Your SFTP Credentials from Namecheap

1. Log in to [Namecheap](https://www.namecheap.com)
2. Go to **Hosting List** → Click **Manage** on your hosting account
3. Look for **FTP Accounts** or **SFTP Accounts** section
4. You'll need:
   - **SFTP Server**: Usually `cowsay.farm` or an IP address
   - **SFTP Username**: Your FTP username
   - **SFTP Password**: Your FTP password
   - **Port**: Should be **22** for SFTP

**Can't find it?** Try:
- cPanel → **FTP Accounts**
- Or check your hosting welcome email from Namecheap

## Step 2: Add GitHub Secrets

1. Go to your repository: https://github.com/m3au/cowsay.farm
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** and add these three secrets:

   **Secret 1:**
   - Name: `SFTP_SERVER`
   - Value: Your SFTP server hostname (e.g., `cowsay.farm` or IP)

   **Secret 2:**
   - Name: `SFTP_USERNAME`
   - Value: Your SFTP username

   **Secret 3:**
   - Name: `SFTP_PASSWORD`
   - Value: Your SFTP password

## Step 3: Test the Deployment

1. Make a small change to your code (or just push)
2. Push to `main` or `master` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. Go to **Actions** tab in GitHub
4. Watch the deployment workflow run
5. Check your site at https://cowsay.farm

## Troubleshooting

- **Workflow fails?** Check the Actions logs for error messages
- **Can't connect?** Verify your SFTP credentials are correct
- **Files not updating?** Make sure the workflow completed successfully

