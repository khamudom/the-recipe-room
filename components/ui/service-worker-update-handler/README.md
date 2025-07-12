# Service Worker Update Handler

This component provides a user-friendly way to handle Progressive Web App (PWA) updates.

## How It Works

1. **Automatic Detection**: The component automatically detects when a new version of the app is available
2. **User Notification**: Shows a notification banner when updates are ready
3. **Manual Control**: Users can choose to update immediately or dismiss the notification
4. **Seamless Update**: When the user clicks "Update Now", the app refreshes with the new version

## Features

- **Non-intrusive**: Update notification appears at the bottom of the screen
- **Dismissible**: Users can choose to update later
- **Visual Feedback**: Shows loading state during update process
- **Mobile Responsive**: Adapts to different screen sizes
- **Vintage Styling**: Matches the app's design theme

## Technical Details

- Uses the `updatefound` and `controllerchange` events to detect updates
- Sends `SKIP_WAITING` message to the service worker to activate updates
- Handles the `SW_UPDATED` message from the service worker
- Automatically refreshes the page after update activation

## Update Flow

1. User deploys new version to production
2. Service worker detects new version and downloads it
3. Update notification appears on user's device
4. User clicks "Update Now" to apply the update
5. App refreshes with the new version
6. User continues using the updated app

## Benefits

- **No Manual Reinstallation**: Users don't need to delete and reinstall the app
- **Immediate Updates**: Updates are applied instantly when user chooses
- **Better UX**: Clear communication about available updates
- **Offline Support**: Updates work even when the app is offline
