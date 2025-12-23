import React from "react";
import Title from "../components/Title";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Title title="About Us" subTitle="Who we are & what we do" />

      <section className="mt-8 space-y-6">
        <p className="text-gray-700 leading-relaxed">
          Welcome to Hotel Booking — your simple, fast way to discover and book
          great hotels around your favorite destinations. We help travelers find
          curated hotels at competitive prices while giving hotel owners a
          friendly dashboard to manage rooms and bookings.
        </p>

        <h3 className="font-semibold text-lg">Our Mission</h3>
        <p className="text-gray-700 leading-relaxed">
          We aim to make travel planning effortless: search, compare, and book
          rooms from trusted hotel owners with transparent pricing and a
          straightforward checkout experience.
        </p>

        <h3 className="font-semibold text-lg">Features</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Search & filter available rooms</li>
          <li>Hotel owner dashboard to add and list rooms</li>
          <li>Secure authentication with cookie-based sessions</li>
          <li>Email booking confirmations</li>
        </ul>

        <h3 className="font-semibold text-lg">Contact</h3>
        <p className="text-gray-700 leading-relaxed">
          Need help or want to partner? Reach out at{" "}
          <strong>support@example.com</strong>.
        </p>
      </section>
    </div>
  );
};

export default About;
