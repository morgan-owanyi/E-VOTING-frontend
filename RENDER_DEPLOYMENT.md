# Deploying Kuravote Frontend to Render

This guide walks you through deploying your React frontend to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your code pushed to GitHub
3. Environment variables configured (if needed)

## Deployment Steps

### Option 1: Deploy via Blueprint (Recommended)

This repository includes a `render.yaml` configuration file that automates the deployment process.

1. **Log in to Render**
   - Go to https://dashboard.render.com

2. **Create New Blueprint**
   - Click "New +" button in the top right
   - Select "Blueprint"

3. **Connect Your Repository**
   - Connect your GitHub account if not already connected
   - Select the `E-VOTING-frontend` repository
   - Render will automatically detect the `render.yaml` file

4. **Review Configuration**
   - Service Name: `kuravote-frontend`
   - Runtime: Node
   - Build Command: `cd kuravote && npm install && npm run build`
   - Static Publish Path: `./kuravote/build`

5. **Deploy**
   - Click "Apply" to create the service
   - Render will start building and deploying your app
   - Wait for the build to complete (usually 3-5 minutes)

6. **Access Your App**
   - Once deployed, you'll get a URL like: `https://kuravote-frontend.onrender.com`

### Option 2: Manual Static Site Setup

If you prefer manual setup:

1. **Log in to Render**
   - Go to https://dashboard.render.com

2. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"

3. **Connect Repository**
   - Connect your GitHub account
   - Select the `E-VOTING-frontend` repository
   - Select the `jordan` branch (or your preferred branch)

4. **Configure Build Settings**
   ```
   Name: kuravote-frontend
   Root Directory: kuravote
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

5. **Advanced Settings** (if needed)
   - Node Version: 18
   - Auto-Deploy: Yes (recommended)

6. **Create Static Site**
   - Click "Create Static Site"
   - Wait for the initial build to complete

## Environment Variables

If your frontend needs environment variables (like API endpoints):

1. Go to your service dashboard
2. Click "Environment" in the left sidebar
3. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-api.onrender.com
   ```
4. Save changes and redeploy

## Custom Domain (Optional)

To use a custom domain:

1. In your service dashboard, go to "Settings"
2. Scroll to "Custom Domains"
3. Click "Add Custom Domain"
4. Follow the instructions to configure DNS

## Automatic Deployments

Render automatically deploys when you push to your connected branch:
- Push changes to GitHub
- Render detects the changes
- Builds and deploys automatically

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify build command works locally: `npm run build`

### Routes Not Working (404 errors)

- The `_redirects` file in `public/` handles client-side routing
- Ensure it's included in your build output

### Slow Build Times

- Consider using Render's paid plans for faster builds
- Optimize dependencies and build process

### Environment Variables Not Working

- React environment variables must start with `REACT_APP_`
- Rebuild after adding/changing environment variables

## Monitoring

- Check build logs: Service Dashboard → "Logs" tab
- Monitor performance: Service Dashboard → "Metrics" tab
- Set up alerts: Service Dashboard → "Settings" → "Notifications"

## Updating Your Deployment

To update your deployed app:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin jordan
   ```
3. Render will automatically detect changes and redeploy

## Cost

- Static sites on Render are **FREE** for up to 100GB bandwidth/month
- Builds are included in the free tier
- Perfect for frontend applications

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- GitHub Issues: Create an issue in your repository

## Next Steps

After deploying your frontend:

1. ✅ Test all routes and functionality
2. ✅ Configure backend API URL in environment variables
3. ✅ Set up custom domain (optional)
4. ✅ Enable HTTPS (automatic on Render)
5. ✅ Monitor performance and errors

Your frontend is now live! 🎉


so application for nominations and application of positions for nomination base on that specified by the admin

this is what the backend shows when run, so lets begin full development now since both the front and backend are fully deployed and running

wont it affect since we initially had converted mySQL database to posterSQL from waht you can see in the backend