import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create Posts
  for (let i = 0; i < 20; i++) {
    await prisma.post.create({
      data: {
        ensemble_id: faker.database.mongodbObjectId(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        website_url: faker.internet.url(),
        type: faker.helpers.arrayElement(['recruitment', 'event']),
        author_id: faker.database.mongodbObjectId(),
        created_at: faker.date.recent(),
      },
    });
  }

  // Create Matches
  for (let i = 0; i < 30; i++) {
    await prisma.match.create({
      data: {
        searching_user_id: faker.database.mongodbObjectId(),
        matched_user_id: faker.database.mongodbObjectId(),
        matched_at: faker.date.recent(),
        match_status: faker.helpers.arrayElement(['new', 'messaged', 'joined']),
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