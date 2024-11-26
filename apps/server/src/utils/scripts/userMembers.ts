import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { User } from "../../schemas/user.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";

async function main() {
  await mongoose.connect(process.env.DATABASE_URL || "");

  // First, get all existing ensemble memberships
  const existingMemberships = await EnsembleMembership.find();

  // Extract unique member IDs
  const uniqueMemberIds = [...new Set(existingMemberships.map((membership) => membership.member))];

  // Create users for each unique member ID
  for (const memberId of uniqueMemberIds) {
    await User.create({
      _id: memberId,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: await bcrypt.hash("password123", 10),
      phone_number: faker.phone.number(),
      bio: faker.lorem.paragraph(),
      instrument: faker.helpers.arrayElement([
        "Violin",
        "Viola",
        "Cello",
        "DoubleBass",
        "Flute",
        "Piano",
      ]),
    });
  }

  console.log(`Created ${uniqueMemberIds.length} users for existing ensemble memberships`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Error creating users:", error);
  process.exit(1);
});
