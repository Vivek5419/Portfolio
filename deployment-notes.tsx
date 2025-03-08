/*
Deployment Considerations:

1. File Size: Videos can be large, which may slow down your site.
   - Consider using a CDN for video hosting (e.g., Cloudinary, Bunny.net)
   - Use video compression to reduce file sizes

2. Hosting Platforms:
   - Vercel has a 4.5MB limit for serverless functions but supports larger assets
   - Netlify has a 100MB limit per file
   - GitHub Pages has a 100MB limit per file

3. Alternatives:
   - For larger videos, consider using YouTube or Vimeo embeds
   - Use a dedicated video hosting service and embed the videos
*/

