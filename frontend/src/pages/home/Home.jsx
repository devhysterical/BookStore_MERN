// import React from 'react'
import Banner from "./Banner";
import News from "./News";
import Recommend from "./Recommend";
import TopSellers from "./TopSellers";

export default function Home() {
  return (
    <>
      <Banner />
      <TopSellers />
      <Recommend />
      <News />
    </>
  );
}
