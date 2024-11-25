import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create Users first
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("password123", 10), // Using a default password for test data
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
      },
    });
    users.push(user);
  }

  // Create Ensembles
  const ensembles = [];
  for (let i = 0; i < 5; i++) {
    const ensemble = await prisma.ensemble.create({
      data: {
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
      },
    });
    ensembles.push(ensemble);
  }

  // Create EnsembleMemberships linking users to ensembles
  for (const ensemble of ensembles) {
    // Randomly select 2-4 users for each ensemble
    const selectedUsers = faker.helpers.arrayElements(users, { min: 2, max: 4 });

    // First user is always the host
    await prisma.ensembleMembership.create({
      data: {
        ensemble_id: ensemble.id,
        member_id: selectedUsers[0].id,
        is_host: true,
      },
    });

    // Rest are regular members
    for (let i = 1; i < selectedUsers.length; i++) {
      await prisma.ensembleMembership.create({
        data: {
          ensemble_id: ensemble.id,
          member_id: selectedUsers[i].id,
          is_host: false,
        },
      });
    }
  }

  // Create Posts (using existing code)
  for (let i = 0; i < 20; i++) {
    await prisma.post.create({
      data: {
        ensemble_id: faker.helpers.arrayElement(ensembles).id,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        website_url: faker.internet.url(),
        type: faker.helpers.arrayElement(["recruitment", "event"]),
        author_id: faker.helpers.arrayElement(users).id,
        created_at: faker.date.recent(),
      },
    });
  }

  // Create Matches (using existing code with actual user IDs)
  for (let i = 0; i < 30; i++) {
    await prisma.match.create({
      data: {
        searching_user_id: faker.helpers.arrayElement(users).id,
        matched_user_id: faker.helpers.arrayElement(users).id,
        matched_at: faker.date.recent(),
        match_status: faker.helpers.arrayElement(["new", "messaged", "joined"]),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
