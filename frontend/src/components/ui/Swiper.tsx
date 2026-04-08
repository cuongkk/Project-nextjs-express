"use client";

import type { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// Modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

type SwiperProps = {
  imageList: string[];
};

const JobImageSwiper: FC<SwiperProps> = ({ imageList }) => {
  if (!imageList?.length) return null;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop
      className="rounded-2xl overflow-hidden"
    >
      {imageList.map((src, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-[300px] md:h-[400px]">
            <Image src={src} alt={`slide-${index + 1}`} fill className="object-cover" priority={index === 0} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

{
  /* {jobDetail.images && jobDetail.images.length > 0 && (
                  <div className="mb-[20px]">
                    <JobImageSwiper imageList={jobDetail.images} />
                  </div>
                )} */
}
export default JobImageSwiper;
