import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { User } from "../../schemas/user.schema";
import { Ensemble } from "../../schemas/ensemble.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);

  try {
    await EnsembleMembership.deleteMany({});
    console.log("Cleared existing ensemble memberships");

    const users = await User.find();
    const ensembles = await Ensemble.find();

    if (!users.length || !ensembles.length) {
      throw new Error("No existing users or ensembles found");
    }

    console.log(`Found ${users.length} users and ${ensembles.length} ensembles`);

    for (const ensemble of ensembles) {
      const randomUsers = faker.helpers.arrayElements(users, { min: 2, max: 5 });

      for (const user of randomUsers) {
        await EnsembleMembership.create({
          ensemble: ensemble._id,
          ensemble_id: ensemble._id.toString(),
          member: user._id,
          member_id: user._id.toString(),
          is_host: true,
        });
      }
    }

    console.log("Successfully created new ensemble memberships");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
