/**
 * One-time migration: rename vehicle.owner -> vehicle.listedBy
 * Run from backend folder: node scripts/migrate-vehicle-schema.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const vehicles = db.collection("vehicles");

    const result = await vehicles.updateMany(
        { owner: { $exists: true }, listedBy: { $exists: false } },
        [{ $set: { listedBy: "$owner" } }]
    );

    console.log(`Migrated ${result.modifiedCount} vehicles (owner -> listedBy)`);

    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error(err);
    process.exit(1);
});
