# 🛒 IranShop - AI-Powered Product Search PWA

A Cimri-like product search website with AI-powered translation from Turkish to Persian. This Progressive Web App (PWA) searches Turkish e-commerce sites and translates product information to Persian/Farsi for Iranian users.

## ✨ Features

- **🔍 AI-Powered Search**: Uses SerpAPI to fetch Turkish products and OpenAI to translate to Persian
- **📱 6 Main Categories**: Electronics, Fashion, Home Appliances, Books, Beauty, Sports
- **🎯 Smart Filtering**: Price range, ratings, popularity sorting
- **📱 PWA Ready**: Installable app with offline functionality
- **🌙 Mobile-First**: Optimized for mobile devices with RTL support
- **💾 Offline Support**: Cached products for offline viewing
- **❤️ Wishlist**: Save favorite products locally
- **🔄 Real-time Translation**: Turkish → Persian using OpenAI

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS with RTL support
- **UI Components**: Radix UI + Custom components
- **APIs**: OpenAI GPT-3.5, SerpAPI
- **PWA**: Service Worker, Web App Manifest
- **State Management**: Zustand, React hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iranshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   SERPAPI_API_KEY=your_serpapi_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

6. **Test PWA Features**
   - Open Chrome DevTools → Application → Manifest
   - Test "Add to Home Screen" functionality
   - Check Service Worker registration in Application tab
   - Use Lighthouse audit to verify PWA compliance

## 🔑 API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create account or sign in
3. Go to API Keys section
4. Create new secret key
5. Copy and add to `.env.local`

### SerpAPI Key
1. Visit [SerpAPI](https://serpapi.com)
2. Sign up for free account
3. Get your API key from dashboard
4. Copy and add to `.env.local`

## 🎯 Usage

### For Users
1. **Browse Categories**: Click on any of the 6 main categories
2. **Search Products**: Use the search bar to find specific items
3. **View Results**: Products are automatically translated to Persian
4. **Apply Filters**: Sort by price, rating, or popularity
5. **Install App**: Use the install banner for native app experience
6. **Offline Access**: View cached products without internet

### Demo Mode
The application includes demo products that work without API keys for testing purposes. When API keys are not configured, the app will show sample Turkish products with Persian translations to demonstrate the functionality.

### For Developers
1. **Demo Mode**: App works without API keys using demo data
2. **API Integration**: Real SerpAPI + OpenAI integration when keys provided
3. **PWA Features**: Service worker handles caching and offline functionality
4. **RTL Support**: Full right-to-left layout for Persian language

## 📱 PWA Features

- **🔧 Installable**: Add to home screen on mobile/desktop
- **⚡ Fast Loading**: Service worker caching
- **📴 Offline Mode**: View cached products offline
- **🔄 Background Sync**: Updates when connection restored
- **📱 Native Feel**: Full-screen, app-like experience

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (root)/           # Main pages
│   ├── api/             # API routes
│   ├── offline/         # Offline page
│   └── globals.css      # Global styles + RTL
├── components/
│   ├── ui/              # Reusable UI components
│   └── shared/          # Shared components
├── lib/
│   ├── demo-data.ts     # Demo products for testing
│   └── utils.ts         # Utility functions
public/
├── manifest.json        # PWA manifest
├── sw.js               # Service worker
└── icons/              # PWA icons
```

## 🌐 API Endpoints

### `/api/search` (POST)
Search for products with translation

**Request:**
```json
{
  "query": "laptop",
  "category": "elektronik",
  "filters": {
    "priceMin": 1000,
    "priceMax": 5000,
    "limit": 20
  }
}
```

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "title": "MacBook Air M2",
      "titlePersian": "مک‌بوک ایر ام۲",
      "price": "28,000 TL",
      "rating": 4.7,
      "image": "https://...",
      "link": "https://...",
      "shop": "AppleStore"
    }
  ],
  "total": 15,
  "query": "laptop"
}
```

## 🎨 Customization

### Categories
Edit categories in `src/app/(root)/page.tsx`:
```typescript
const categories = [
  {
    name: 'الکترونیک',      // Persian name
    nameEn: 'Electronics',   // English name
    icon: '📱',             // Emoji icon
    query: 'elektronik',    // Turkish search term
    color: 'bg-purple-500'  // Tailwind color
  }
  // ... more categories
];
```

### Styling
- **Colors**: Edit `src/app/globals.css` CSS variables
- **Components**: Customize in `src/components/ui/`
- **Layout**: Modify main page in `src/app/(root)/page.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Works with build command `npm run build`
- **Railway**: Supports Next.js deployment
- **Replit**: Use "Always On" for persistent hosting

## 🔧 Development

### Testing PWA
1. Build production version: `npm run build`
2. Start production server: `npm start`
3. Test with Lighthouse in Chrome DevTools
4. Verify PWA installation prompt

### Adding Features
- **New APIs**: Add routes in `src/app/api/`
- **Components**: Create in `src/components/`
- **Pages**: Add to `src/app/`
- **Styles**: Update `src/app/globals.css`

## 📈 Performance

- **Core Web Vitals**: Optimized for fast loading
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Service worker + browser caching
- **Bundle Size**: Minimal dependencies

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: Create GitHub issue
- **Questions**: Check README or create discussion
- **API Problems**: Verify API keys and quotas

## 🔮 Roadmap

- [ ] User authentication
- [ ] Advanced filters
- [ ] Price tracking
- [ ] Telegram bot integration
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Product comparison
- [ ] Push notifications

---

**Made with ❤️ for Iranian users seeking Turkish products**
