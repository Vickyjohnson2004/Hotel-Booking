import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "./models/Room.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected... Starting Room Seed"))
  .catch((err) => console.error(err));

const rooms = [
  // ROOMS FOR: The Grand Azure Resort (69502bd26c5c3ae5fb55d61a)
  {
    hotel: "69502bd26c5c3ae5fb55d61a",
    title: "Deluxe Ocean Suite",
    price: 450,
    maxGuests: 2,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
    ],
    amenities: ["King Bed", "Ocean View", "Mini Bar", "Balcony"],
    isAvailable: true,
  },
  {
    hotel: "69502bd26c5c3ae5fb55d61a",
    title: "Presidential Beach Villa",
    price: 950,
    maxGuests: 4,
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9759678?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1591088398332-8a77d399c843?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800",
    ],
    amenities: ["Private Pool", "Kitchen", "WiFi", "Butler Service"],
    isAvailable: true,
  },

  // ROOMS FOR: Mountain Peak Lodge (69502bd26c5c3ae5fb55d61b)
  {
    hotel: "69502bd26c5c3ae5fb55d61b",
    title: "Rustic Log Cabin",
    price: 180,
    maxGuests: 2,
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    ],
    amenities: ["Fireplace", "Heating", "Mountain View"],
    isAvailable: true,
  },
  {
    hotel: "69502bd26c5c3ae5fb55d61b",
    title: "Family Ski Chalet",
    price: 350,
    maxGuests: 6,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1464146072230-91cabc9fa7c0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
    ],
    amenities: ["Bunk Beds", "Gear Storage", "Breakfast Included"],
    isAvailable: true,
  },
];

const seedRooms = async () => {
  try {
    // Clears existing rooms for these specific hotels
    await Room.deleteMany({
      hotel: { $in: ["69502bd26c5c3ae5fb55d61a", "69502bd26c5c3ae5fb55d61b"] },
    });

    await Room.insertMany(rooms);
    console.log(
      "✅ Rooms seeded with multiple images and linked successfully!"
    );
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding rooms:", err.message);
    process.exit(1);
  }
};

seedRooms();
