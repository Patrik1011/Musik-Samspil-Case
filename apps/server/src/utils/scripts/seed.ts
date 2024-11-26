import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { User } from "../../schemas/user.schema";
import { Ensemble } from "../../schemas/ensemble.schema";
import { Post } from "../../schemas/post.schema";
import { Match } from "../../schemas/match.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";

async function main() {
  await mongoose.connect(process.env.DATABASE_URL || "");

  // Create Users first
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await User.create({
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
    users.push(user);
  }

  // Create Ensembles
  const ensembles = [];
  for (let i = 0; i < 5; i++) {
    const ensemble = await Ensemble.create({
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      location: {
        city: faker.location.city(),
        country: faker.location.country(),
        address: faker.location.streetAddress(),
      },
      open_positions: faker.helpers.arrayElements(
        ["Violin", "Viola", "Cello", "DoubleBass", "Flute", "Piano"],
        { min: 1, max: 3 },
      ),
      is_active: true,
    });
    ensembles.push(ensemble);
  }

  // Create EnsembleMemberships
  for (const ensemble of ensembles) {
    const randomUsers = faker.helpers.arrayElements(users, { min: 2, max: 5 });
    for (const user of randomUsers) {
      await EnsembleMembership.create({
        ensemble: ensemble._id,
        member: user._id,
        is_host: user === randomUsers[0], // First user is host
      });
    }
  }

  // Create Posts
  for (let i = 0; i < 20; i++) {
    await Post.create({
      ensemble: faker.helpers.arrayElement(ensembles)._id,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      website_url: faker.internet.url(),
      type: faker.helpers.arrayElement(["recruitment", "event"]),
      author: faker.helpers.arrayElement(users)._id,
      created_at: faker.date.recent(),
    });
  }

  // Create Matches
  for (let i = 0; i < 30; i++) {
    await Match.create({
      searching_user: faker.helpers.arrayElement(users)._id,
      matched_user: faker.helpers.arrayElement(users)._id,
      matched_at: faker.date.recent(),
      match_status: faker.helpers.arrayElement(["new", "messaged", "joined"]),
    });
  }

  console.log("Seed completed successfully");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
