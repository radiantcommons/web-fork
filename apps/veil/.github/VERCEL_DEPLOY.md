# Vercel Deployment Setup

This project is set up to deploy to Vercel using GitHub Actions to handle the WebAssembly compilation.

## Setup Instructions

1. Create the following secrets in your GitHub repository:

   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: The ID of your Vercel project

2. Push to the main branch or any feature branch to trigger a deployment.

## How It Works

The deployment process:

1. GitHub Actions builds the project including WebAssembly compilation
2. The Action deploys the pre-built app to Vercel

## Syncing with Upstream

There's also a GitHub Action to sync with the upstream repository:

- It runs daily automatically
- You can also manually trigger it from the Actions tab

## Troubleshooting

If you encounter issues with the deployment:

1. Check the GitHub Actions logs for build errors
2. Verify your Vercel project settings
3. Ensure your Vercel secrets are correctly configured