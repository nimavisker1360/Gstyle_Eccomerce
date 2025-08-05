# راهنمای Deploy در Vercel

## مراحل Deploy

### 1. نصب Vercel CLI
```bash
npm i -g vercel
```

### 2. Login به Vercel
```bash
vercel login
```

### 3. Deploy پروژه
```bash
vercel --prod
```

## تنظیمات Environment Variables در Vercel

### 1. MongoDB URI
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gstyle-ecommerce
```

### 2. SerpAPI Key
```
SERPAPI_KEY=your-serpapi-key-here
```

### 3. Cron Secret
```
CRON_SECRET=your-secret-key-here
```

### 4. Cache Settings
```
CACHE_TTL_HOURS=24
CACHE_MAX_RESULTS=100
CACHE_PRELOAD_INTERVAL=6
```

## تست عملکرد

### 1. تست کش
```bash
curl "https://your-app.vercel.app/api/cache?action=stats"
```

### 2. تست جستجو
```bash
curl "https://your-app.vercel.app/api/shopping?q=لباس"
```

### 3. تست پر کردن کش
```bash
curl "https://your-app.vercel.app/api/cache?action=preload"
```

## مزایای Deploy در Vercel

1. **سرعت بالا**: CDN جهانی
2. **Cron Jobs**: نگهداری خودکار کش
3. **Environment Variables**: مدیریت امن متغیرها
4. **Auto Scaling**: مقیاس‌پذیری خودکار

## نظارت بر عملکرد

### 1. Vercel Analytics
- سرعت بارگذاری
- تعداد درخواست‌ها
- خطاها

### 2. کش آمار
```bash
curl "https://your-app.vercel.app/api/cache?action=stats"
```

### 3. لاگ‌ها
- Vercel Dashboard > Functions
- بررسی خطاها و عملکرد

## بهینه‌سازی

### 1. Cache Hit Rate
- هدف: 70-80%
- نظارت روزانه

### 2. Response Time
- هدف: < 500ms برای کش
- هدف: < 2s برای SerpAPI

### 3. Cost Optimization
- کاهش درخواست‌های SerpAPI
- استفاده بهینه از کش 