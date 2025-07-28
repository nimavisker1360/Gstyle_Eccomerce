'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-6">📶</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          اتصال اینترنت قطع است
        </h1>
        <p className="text-gray-600 mb-6">
          لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={handleRefresh}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            تلاش مجدد
          </Button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>برخی محتویات ممکن است در حالت آفلاین در دسترس باشند</p>
        </div>
      </Card>
    </div>
  );
}