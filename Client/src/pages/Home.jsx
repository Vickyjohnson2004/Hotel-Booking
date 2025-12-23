import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonia from "../components/Testimonia";
import NewsLetter from "../components/NewsLetter";
import RecommendedHotel from "../components/RecommendedHotel";

const Home = () => {
  return (
    <>
      <Hero />
      <RecommendedHotel />
      <ExclusiveOffers />
      <FeaturedDestination />
      <Testimonia />
      <NewsLetter />
    </>
  );
};

export default Home;
