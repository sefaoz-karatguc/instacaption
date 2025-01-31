## Instacaption Web App
An AI powered web app to generate captions for Instagram posts. Caption generation will happen after user uploads the photos they wanna share and give a little brief about the post. AI will create the caption and give it back to the user. User will be able to copy it to the clipboard. We should keep created captions in supabase database, initially user doesn't have to be signed in, first trial is free for everyone, but if they wanna do for the second time we should be able to somehow check if they have done it before and warn them that they need to sign in to the app in order to generate the second or more captions. Offering Google Sign In and Instagram Sign In. Next-Auth is the provider

UI approach: support dark theme, responsive design. Shadcn-UI for UI components.

TODO LIST
0. Set up project repository
Initialize a new repository for the project and set up the basic structure using Next.js and TypeScript.

1. Design UI mockups
Create initial UI mockups for the app using Figma, focusing on user flow from photo upload to caption generation.

2. Implement photo upload feature
Develop the feature allowing users to upload photos for caption generation.

3. Integrate AI caption generation
Integrate AI service to generate captions based on uploaded photos and user input.

4. Implement clipboard copy feature
Allow users to copy generated captions to their clipboard.

5. Set up Supabase database
Configure Supabase to store generated captions and manage user data.

6. Implement user authentication
Add Google, Instagram, and Apple Sign In options for user authentication.

7. Limit free trials and prompt sign-in
Implement logic to track free trials and prompt users to sign in after their first free caption generation.

8. UI enhancements with TailwindCSS and Shadcn-UI
Enhance the UI using TailwindCSS and Shadcn-UI for a polished look and feel.