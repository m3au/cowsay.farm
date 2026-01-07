# Cowsayco Twitter Bot

Welcome to the Cowsayco Twitter Bot repository. This project combines the classic command-line program `cowsay` with the power of social media, delivering a daily dose of oxytocin through curated quotes presented in unique ASCII art messages.

## About

This Twitter bot tweets a random cowsay message daily. It was created by m3auso using a variety of technologies including node.js, cowsay, lolcatjs, ansi-to-html, puppeteer, and twitter-api-v2. The bot is hosted on render.com and its source code is available on GitHub.

## Technologies

Here's a brief overview of the main technologies used in this project:

- **Twitter bot**: Handles the tweeting functionality.
- **ansi-to-html**: Converts ANSI escape codes into HTML elements.
- **cowsay**: Generates ASCII pictures of a cow with a message in a speech bubble.
- **dotenv**: Loads environment variables from a .env file into process.env.
- **lolcatjs**: Applies rainbow colors to text in the terminal.
- **node-html-to-image**: Generates images from HTML code.
- **node-pty**: Creates and interacts with pseudoterminals.
- **twitter-api-v2**: A comprehensive Twitter v2 API client for Node.js.
- **TypeScript**: A statically typed superset of JavaScript.
- **word-wrap**: Wraps input text into a column of specified width.
- **@types/node and @types/lolcatjs**: Provide TypeScript definitions for Node.js and lolcatjs.
- **GitHub Actions**: A CI/CD system fully integrated with GitHub.
- **Cron Job**: A time-based job scheduler in Unix-like operating systems.
- **Puppeteer**: A Node.js library which provides a high-level API to control Chrome or Chromium.
- **render.com**: A platform for building, hosting, and maintaining web projects.

## Webpage

The webpage for this project is built using Astro with the Cactus Theme, and styled with Tailwind CSS. Content is written in Markdown and MDX. Other tools used include Satori for generating Open Graph images, Pagefind for static search functionality, Astro Icon for SVG icons, and Expressive Code for visually appealing source code display.

## Token Contract Address Setup

After the token launch, you need to configure the contract address to display it on the homepage with a QR code. There are three ways to set it:

### Option 1: Environment Variable (Recommended for Local Development)

1. Create or update your `.env` file in the project root:
   ```bash
   CONTRACT_ADDRESS=YourSolanaContractAddressHere
   ```

2. The contract address will automatically be picked up during build time.

### Option 2: Direct Configuration

1. Open `src/site.config.ts`
2. Update the `contractAddress` field:
   ```typescript
   contractAddress: "YourSolanaContractAddressHere",
   ```

### Option 3: GitHub Actions Secret (For CI/CD Deployments)

If you're using GitHub Actions for deployment, add the contract address as a repository secret:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `CONTRACT_ADDRESS`
   - **Value**: Your Solana contract address

The deployment workflow (`.github/workflows/deploy.yml`) is already configured to use this secret during the build process.

Once the contract address is set, it will automatically appear on the homepage with:
- A QR code for easy scanning
- The full contract address in a copyable format
- A copy button for quick sharing

**Note:** The contract address section will only display when a contract address is configured. If no address is set, the section will be hidden.

## Contribute

To learn more or to contribute to this project, visit our bot's repository or this homepage's repo.
