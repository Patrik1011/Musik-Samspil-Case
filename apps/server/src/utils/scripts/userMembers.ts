import { PrismaClient, EnsembleMembership } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // First, get all existing ensemble memberships
  const existingMemberships = await prisma.ensembleMembership.findMany();

  // Extract unique member IDs
  const uniqueMemberIds = [
    ...new Set(existingMemberships.map((membership: EnsembleMembership) => membership.member_id)),
  ];

  // Create users for each unique member ID
  for (const memberId of uniqueMemberIds) {
    await prisma.user.create({
      data: {
        id: memberId,
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
      },
    });
  }

  console.log(`Created ${uniqueMemberIds.length} users for existing ensemble memberships`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
