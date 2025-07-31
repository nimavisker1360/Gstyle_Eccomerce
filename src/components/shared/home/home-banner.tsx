"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function HomeBanner() {
  const bannerImages = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="w-full bg-white relative">
      {/* Banner container aligned with header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="relative overflow-hidden">
            {/* Carousel container */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {bannerImages.map((image, index) => (
                <div key={index} className="flex-shrink-0 w-full h-80 relative">
                  <Image
                    src={image}
                    alt={`Banner ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {bannerImages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  index === currentSlide ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
