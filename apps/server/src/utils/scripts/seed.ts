import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  for (let i = 0; i < 50; i++) {
    await prisma.user.create({
      data: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone_number: faker.phone.number(),
        bio: faker.lorem.sentence(),
        instrument: faker.helpers.arrayElement([
         'Violin', 'Viola', 'Cello', 'Double Bass', 
         'Flute', 'Oboe', 'Clarinet', 'Bassoon', 'French Horn', 
        ]),
      },
    });
  }

  // Create Ensembles
  for (let i = 0; i < 10; i++) {
    await prisma.ensemble.create({
      data: {
        name: faker.company.name(),
        location: {
          type: 'Point',
          coordinates: [parseFloat(faker.address.longitude()), parseFloat(faker.address.latitude())],
        },
        hosts: [faker.internet.email()],
        open_positions: [faker.music.genre()],
        is_active: faker.datatype.boolean(),
        member_ids: Array.from({ length: 5 }, () => faker.database.mongodbObjectId()),
      },
    });
  }

  // Create Posts
  for (let i = 0; i < 20; i++) {
    await prisma.post.create({
      data: {
        ensemble_id: faker.database.mongodbObjectId(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        website: faker.internet.url(),
        type: faker.helpers.arrayElement(['recruitment', 'event']),
        author_id: faker.database.mongodbObjectId(),
        createdAt: faker.date.recent(),
      },
    });
  }

  // Create Matches
  for (let i = 0; i < 30; i++) {
    await prisma.match.create({
      data: {
        searching_user_id: faker.database.mongodbObjectId(),
        matched_user_id: faker.database.mongodbObjectId(),
        matchedAt: faker.date.recent(),
        match_status: faker.helpers.arrayElement(['messaged', 'confirmed']),
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