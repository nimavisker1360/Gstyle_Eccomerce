# راهنمای پیاده‌سازی کش برای SerpAPI

## خلاصه

این راه حل کش برای کاهش هزینه‌های SerpAPI و افزایش سرعت سایت طراحی شده است. کش نتایج جستجو را در MongoDB ذخیره می‌کند و تا 80% درخواست‌های SerpAPI را کاهش می‌دهد.

## فایل‌های ایجاد شده

### 1. مدل کش (`src/lib/db/models/cache.model.ts`)

- ذخیره نتایج جستجو در MongoDB
- TTL خودکار برای منقضی شدن
- آمار بازدید و آخرین دسترسی

### 2. سرویس کش (`src/lib/services/cache.service.ts`)

- مدیریت عملیات کش
- آمار عملکرد
- پاک‌سازی خودکار

### 3. سرویس SerpAPI (`src/lib/services/serpapi.service.ts`)

- جستجو با کش
- پر کردن خودکار کوئری‌های محبوب

### 4. API کش (`src/app/api/cache/route.ts`)

- مدیریت کش از طریق API
- آمار و گزارش‌گیری

### 5. Cron Job (`src/app/api/cron/cache-maintenance/route.ts`)

- نگهداری خودکار کش
- پر کردن کوئری‌های محبوب

## نحوه استفاده

### 1. بررسی آمار کش

```bash
curl https://your-domain.com/api/cache?action=stats
```

### 2. مشاهده کوئری‌های محبوب

```bash
curl https://your-domain.com/api/cache?action=popular
```

### 3. پاک کردن کش منقضی شده

```bash
curl https://your-domain.com/api/cache?action=cleanup
```

### 4. پر کردن کوئری‌های محبوب

```bash
curl https://your-domain.com/api/cache?action=preload
```

### 5. اجباری کردن درخواست جدید

```bash
curl "https://your-domain.com/api/shopping?q=لباس&refresh=true"
```

## تنظیمات Cron Job

### برای Vercel (cron.json)

```json
{
  "version": 2,
  "crons": [
    {
      "path": "/api/cron/cache-maintenance",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### برای سرورهای دیگر

```bash
# هر 6 ساعت
0 */6 * * * curl -X POST https://your-domain.com/api/cron/cache-maintenance \
  -H "Authorization: Bearer your-secret-key"
```

## متغیرهای محیطی

```env
# Cache Settings
CACHE_TTL_HOURS=24
CACHE_MAX_RESULTS=100
CACHE_PRELOAD_INTERVAL=6

# Cron Settings
CRON_SECRET=your-secret-key-here

# Existing Settings
SERPAPI_KEY=your-serpapi-key
MONGODB_URI=your-mongodb-uri
```

## مزایا

### 1. صرفه‌جویی در هزینه

- تا 80% کاهش درخواست‌های SerpAPI
- TTL هوشمند برای محصولات مختلف

### 2. سرعت بالا

- پاسخ‌های فوری از کش
- کاهش زمان بارگذاری

### 3. مدیریت هوشمند

- آمار دقیق عملکرد
- پاک‌سازی خودکار
- پر کردن کوئری‌های محبوب

### 4. انعطاف‌پذیری

- امکان اجباری کردن درخواست جدید
- تنظیم TTL برای انواع مختلف محصولات

## آمار عملکرد

### Hit Rate

- هدف: 70-80%
- محاسبه: (hits / (hits + misses)) \* 100

### TTL پیشنهادی

- محصولات محبوب: 24 ساعت
- محصولات کم‌طرفدار: 6 ساعت
- محصولات فصلی: 12 ساعت

## عیب‌یابی

### مشکل: کش کار نمی‌کند

1. بررسی اتصال MongoDB
2. بررسی متغیرهای محیطی
3. بررسی لاگ‌های سرور

### مشکل: نتایج قدیمی

1. استفاده از `refresh=true`
2. پاک کردن کش منقضی شده
3. بررسی TTL تنظیمات

### مشکل: سرعت پایین

1. بررسی آمار hit rate
2. پر کردن کوئری‌های محبوب
3. بهینه‌سازی کوئری‌های MongoDB

## بهینه‌سازی

### 1. کوئری‌های محبوب

```javascript
const popularQueries = [
  "لباس زنانه",
  "کفش ورزشی",
  "ساعت مچی",
  "کیف دستی",
  "لوازم آرایشی",
  "لوازم الکترونیکی",
  "اسباب بازی",
  "LC Waikiki",
  "Koton",
  "Mavi",
];
```

### 2. تنظیمات TTL

```javascript
// محصولات محبوب
await cacheService.setCachedResults(query, "search", results, 50, 24);

// محصولات کم‌طرفدار
await cacheService.setCachedResults(query, "search", results, 30, 6);

// محصولات فصلی
await cacheService.setCachedResults(query, "search", results, 40, 12);
```

### 3. حداکثر نتایج

```javascript
// برای هر درخواست SerpAPI
num: Math.min(maxResults, 100); // حداکثر 100 نتیجه
```

## نظارت و گزارش‌گیری

### 1. آمار روزانه

```bash
curl https://your-domain.com/api/cache?action=stats
```

### 2. کوئری‌های محبوب

```bash
curl https://your-domain.com/api/cache?action=popular
```

### 3. لاگ‌های سرور

```bash
# بررسی لاگ‌های کش
grep "Cache" /var/log/your-app.log
```

## نکات مهم

1. **امنیت**: از `CRON_SECRET` قوی استفاده کنید
2. **نظارت**: آمار کش را روزانه بررسی کنید
3. **بهینه‌سازی**: کوئری‌های محبوب را شناسایی و پر کنید
4. **نگهداری**: کش منقضی شده را مرتب پاک کنید
5. **تست**: عملکرد کش را در محیط توسعه تست کنید

## نتیجه‌گیری

این راه حل کش به شما امکان می‌دهد:

- هزینه‌های SerpAPI را تا 80% کاهش دهید
- سرعت سایت را به طور قابل توجهی افزایش دهید
- مدیریت هوشمند کش داشته باشید
- آمار دقیق عملکرد داشته باشید

برای شروع، فایل‌های ایجاد شده را بررسی کنید و تنظیمات محیطی را انجام دهید.
