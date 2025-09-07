# 🎵 Royalty Free Music Player

A beautiful, modern React Native app for discovering and streaming high-quality royalty-free music from Jamendo's extensive catalog. Built with Expo, TypeScript, and Redux Toolkit for a smooth cross-platform experience.

![App Icon](./assets/images/icon.png)

## ✨ Features

- **🎼 Music Discovery**: Browse thousands of high-quality royalty-free tracks
- **🔍 Smart Search**: Find music by title, artist, genre, or tags
- **🎯 Advanced Filtering**: Filter by popularity, release date, featured status
- **🎧 Audio Streaming**: High-quality audio playback with controls
- **📱 Cross-Platform**: Native iOS and Android experience
- **♾️ Infinite Scrolling**: Smooth pagination for large music catalogs
- **💾 Offline Ready**: State persistence and offline support
- **🎨 Modern UI**: Clean, intuitive design with smooth animations

## 🛠 Tech Stack

- **Frontend**: React Native 0.79.6, Expo SDK 53
- **Language**: TypeScript 5.8
- **State Management**: Redux Toolkit + React Redux
- **Data Fetching**: TanStack React Query
- **Navigation**: Expo Router with typed routes
- **Audio**: Expo Audio for music playback
- **Styling**: React Native StyleSheet with theme support
- **Build System**: EAS Build
- **API**: Jamendo API v3.0

## 🚀 Quick Start

### Prerequisites

- Node.js (18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BruceSuperProgramer/royalty-free-service-app.git
   cd royalty-free-service-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_JAMENDO_API_BASE_URL=https://api.jamendo.com/v3.0
   EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_jamendo_client_id_here
   ```

   > **Note**: Get your free Jamendo API client ID at [Jamendo Developer Portal](https://developer.jamendo.com/)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android  
   npm run android
   ```

## 📁 Project Structure

```
├── app/                          # Expo Router pages
│   ├── index.tsx                 # Main music library screen
│   ├── track/[id].tsx           # Track detail screen
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx          # 404 page
├── components/                   # Reusable UI components
│   ├── music/                   # Music-specific components
│   ├── player/                  # Audio player components
│   └── track/                   # Track detail components
├── hooks/                       # Custom React hooks
│   ├── useAudioPlayer.ts       # Audio playback logic
│   ├── useTracks.ts            # Data fetching hooks
│   └── useTrackNavigation.ts   # Navigation utilities
├── services/                    # API services
│   └── jamendo.ts              # Jamendo API client
├── store/                       # Redux store
│   ├── slices/                 # Redux slices
│   ├── hooks.ts                # Typed Redux hooks
│   └── index.ts                # Store configuration
├── types/                       # TypeScript type definitions
│   └── music.ts                # Music-related types
├── constants/                   # App constants
│   └── Colors.ts               # Theme colors
└── utils/                       # Utility functions
    └── formatters.ts           # Data formatting helpers
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_JAMENDO_API_BASE_URL` | Jamendo API base URL | Yes |
| `EXPO_PUBLIC_JAMENDO_CLIENT_ID` | Your Jamendo API client ID | Yes |

### App Configuration

The app is configured through `app.json` and `eas.json`:

- **Bundle Identifiers**:
  - iOS: `com.royaltyfreemusicplayer.app`
  - Android: `com.royaltyfreemusicplayer.app`
- **Permissions**: Audio recording and modification (for playback)
- **Icon & Splash Screen**: Located in `assets/images/`

## 🎵 API Integration

The app integrates with the [Jamendo API v3.0](https://developer.jamendo.com/v3.0) to provide:

### Available Endpoints

- **GET /tracks**: Fetch music tracks with filtering and pagination
- **GET /tracks/:id**: Get detailed track information

### Query Parameters

```typescript
interface TracksQueryParams {
  search?: string;           // Search query
  tags?: string;             // Genre/instrument tags
  order?: 'releasedate_desc' | 'popularity_total' | 'name_asc';
  featured?: boolean;        // Featured tracks only
  limit?: number;           // Results per page (default: 20)
  offset?: number;          // Pagination offset
}
```

### Example Usage

```typescript
import { fetchTracks, fetchTrackById } from '@/services/jamendo';

// Fetch popular tracks
const { tracks, hasMore } = await fetchTracks({
  order: 'popularity_total',
  featured: true,
  limit: 20
});

// Search for jazz tracks
const results = await fetchTracks({
  search: 'jazz',
  tags: 'jazz',
  limit: 10
});

// Get track details
const track = await fetchTrackById(123456);
```

## 📱 Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator  
npm run lint       # Run ESLint
```

### Development Workflow

1. **Code Organization**: Follow the established folder structure
2. **Type Safety**: Use TypeScript for all new code
3. **State Management**: Use Redux Toolkit for global state
4. **API Calls**: Use React Query for data fetching
5. **Styling**: Use StyleSheet with theme constants
6. **Testing**: Run `npm run lint` before committing

### Key Hooks

- `useTracks()`: Fetch and cache music tracks
- `useAudioPlayer()`: Control audio playback
- `useTrackNavigation()`: Handle navigation and search
- `useThemeColor()`: Access theme colors

## 🏗 Building & Deployment

### EAS Build

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for creating production builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for development
eas build --profile development --platform all

# Build for production  
eas build --profile production --platform all
```

### Build Profiles

- **Development**: Includes dev tools, runs on simulator
- **Preview**: Internal distribution for testing
- **Production**: App store ready builds

### Deployment

- **iOS**: Submit to App Store via EAS Submit
- **Android**: Submit to Google Play Store via EAS Submit

```bash
# Submit to app stores
eas submit --platform all
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Run linting**: `npm run lint`
5. **Test thoroughly** on both iOS and Android
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Coding Standards

- Use TypeScript for type safety
- Follow React Native best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Jamendo](https://jamendo.com)** - For providing the royalty-free music API
- **[Expo](https://expo.dev)** - For the amazing React Native development platform
- **React Native Community** - For the excellent tools and libraries

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check existing [GitHub Issues](https://github.com/BruceSuperProgramer/royalty-free-service-app/issues)
2. Create a new issue with detailed reproduction steps
3. Include device/OS information and error logs

---

**Made with ❤️ and 🎵 by [BruceSuperProgramer](https://github.com/BruceSuperProgramer)**

> Discover amazing royalty-free music and support independent artists through Jamendo's platform!