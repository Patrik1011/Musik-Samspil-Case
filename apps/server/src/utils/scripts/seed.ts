import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create Ensembles
  for (let i = 0; i < 10; i++) {
    await prisma.ensemble.create({
      data: {
        name: faker.company.name(),
        location: {
          type: 'Point',
          coordinates: [parseFloat(faker.address.longitude()), parseFloat(faker.address.latitude())],
        },
        hosts: [],
        open_positions: [faker.music.genre()],
        is_active: faker.datatype.boolean(),
      },
    });
  }

  // Create Posts
  for (let i = 0; i < 20; i++) {
    await prisma.post.create({
      data: {
        ensemble_id: faker.datatype.number({ min: 1, max: 10 }),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        time_posted: faker.date.recent(),
        website_link: faker.internet.url(),
        post_type: faker.helpers.arrayElement(['recruitment', 'event']),
      },
    });
  }

  // Create Matches
  for (let i = 0; i < 30; i++) {
    await prisma.match.create({
      data: {
        user_id: faker.datatype.number({ min: 1, max: 50 }), // Assuming user IDs range from 1 to 50
        ensemble_id: faker.datatype.number({ min: 1, max: 10 }),
        match_status: faker.helpers.arrayElement(['pending', 'accepted', 'rejected']),
        distance: faker.datatype.float({ min: 0, max: 100 }),
      },
    });
  }

  // Create Conversations
  for (let i = 0; i < 15; i++) {
    await prisma.conversation.create({
      data: {
        participants: [faker.datatype.number({ min: 1, max: 50 }), faker.datatype.number({ min: 1, max: 50 })],
        messages: [
          {
            sender_id: faker.datatype.number({ min: 1, max: 50 }),
            content: faker.lorem.sentence(),
            timestamp: faker.date.recent(),
          },
        ],
      },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });