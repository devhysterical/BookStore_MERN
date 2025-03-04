// import React from "react";

import bannerImg from "../../assets/banner.png";

export default function Banner() {
  return (
    <div className="flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12">
      <div className="md:w-1/2 w-full flex items-center md:justify-end">
        <img src={bannerImg} alt="banner" />
      </div>

      <div className="md:w-1/2 w-full">
        <h1 className="md:text-5xl text-2xl font-medium mb-7">
          New Releases This Week
        </h1>
        <p className="mb-10">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nihil,
          alias architecto maxime explicabo dolorem perspiciatis voluptates quod
          et, libero sint accusantium, nulla atque ratione esse. Esse error
          tempora odio!
        </p>
        <button className="btn-primary">Shop now</button>
      </div>
    </div>
  );
}
