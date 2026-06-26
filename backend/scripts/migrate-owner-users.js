/**
 * Convert legacy owner accounts to renter.
 * Run: node scripts/migrate-owner-users.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const users = db.collection("users");

    const result = await users.updateMany(
        { role: "owner" },
        { $set: { role: "renter" } }
    );

    console.log(`Migrated ${result.modifiedCount} owner account(s) to renter`);
    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error(err);
    process.exit(1);
});
