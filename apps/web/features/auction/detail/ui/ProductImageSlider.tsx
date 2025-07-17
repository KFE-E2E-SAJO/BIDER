'use client';
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';
import { ProductImage } from '@/entities/productImage/model/types';

interface Props {
  images: ProductImage[];
}

export default function ProductImageSlider({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="w-full">
      {/* Main Swiper */}
      <div className="flex h-[310px] items-center justify-center overflow-hidden">
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full p-0"
        >
          {images.map((img) => (
            <SwiperSlide key={img.image_id} className="flex items-center justify-center">
              <img
                src={img.image_url}
                alt="Product"
                className="mx-auto h-full w-auto object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Gallery */}
      <div className="p-box mt-4 flex justify-between">
        {images.map((img, idx) => (
          <button
            key={img.image_id}
            onClick={() => {
              swiperRef.current?.slideTo(idx);
            }}
            className={`size-[60px] shrink-0 border ${
              activeIndex === idx ? 'border-neutral-900' : 'border-transparent'
            } overflow-hidden`}
          >
            <img src={img.image_url} alt="thumbnail" className="h-full w-full object-cover" />
          </button>
        ))}
        {[...Array(5 - images.length)].map((_, idx) => (
          <div key={`empty-${idx}`} className="pointer-events-none h-16 w-16 shrink-0 opacity-0" />
        ))}
      </div>
    </div>
  );
}
