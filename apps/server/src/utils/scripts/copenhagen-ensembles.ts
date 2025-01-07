import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Ensemble } from "../../schemas/ensemble.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import { Instrument } from "../../utils/types/enums";

// Real Copenhagen neighborhoods with their approximate coordinates
const COPENHAGEN_AREAS = [
  {
    name: "Indre By",
    latitude: 55.6811,
    longitude: 12.5762,
    streets: ["Strøget", "Gothersgade", "Store Kongensgade", "Bredgade", "Nyhavn"],
  },
  {
    name: "Nørrebro",
    latitude: 55.6937,
    longitude: 12.5476,
    streets: ["Nørrebrogade", "Jagtvej", "Stefansgade", "Elmegade", "Ravnsborggade"],
  },
  {
    name: "Vesterbro",
    latitude: 55.6697,
    longitude: 12.5544,
    streets: ["Istedgade", "Vesterbrogade", "Sønder Boulevard", "Matthæusgade", "Viktoriagade"],
  },
  {
    name: "Østerbro",
    latitude: 55.7076,
    longitude: 12.5748,
    streets: [
      "Østerbrogade",
      "Nordre Frihavnsgade",
      "Strandboulevarden",
      "Trianglen",
      "Classensgade",
    ],
  },
  {
    name: "Frederiksberg",
    latitude: 55.6785,
    longitude: 12.5322,
    streets: ["Gammel Kongevej", "Frederiksberg Allé", "Falkoner Allé", "Godthåbsvej", "Pile Allé"],
  },
  {
    name: "Amager",
    latitude: 55.65,
    longitude: 12.59,
    streets: ["Amagerbrogade", "Islands Brygge", "Øresundsvej", "Holmbladsgade", "Vermlandsgade"],
  },
  {
    name: "Christianshavn",
    latitude: 55.6733,
    longitude: 12.5927,
    streets: [
      "Torvegade",
      "Prinsessegade",
      "Christianshavns Voldgade",
      "Overgaden oven Vandet",
      "Strandgade",
    ],
  },
  {
    name: "Valby",
    latitude: 55.6666,
    longitude: 12.5166,
    streets: [
      "Valby Langgade",
      "Toftegårds Allé",
      "Vigerslev Allé",
      "Gl. Jernbanevej",
      "Skolegade",
    ],
  },
];

// Generate a random point within 1km of an area center
function generateNearbyCoordinates(centerLat: number, centerLng: number) {
  const radiusKm = 0.7; // ~700m radius
  const radiusInDegrees = radiusKm / 111;

  const angle = Math.random() * 2 * Math.PI;
  const randomRadius = Math.sqrt(Math.random()) * radiusInDegrees;

  const lat = centerLat + randomRadius * Math.cos(angle);
  const lng = centerLng + randomRadius * Math.sin(angle);

  return { latitude: lat, longitude: lng };
}

// Helper function to get a random filled position that's not in open positions
function getFilledPosition(openPositions: Instrument[]): Instrument {
  const allInstruments = Object.values(Instrument);
  const filledPositions = allInstruments.filter(
    (instrument) => !openPositions.includes(instrument),
  );
  return faker.helpers.arrayElement(filledPositions);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);

  try {
    const hostUserId = "";
    const ensemblesPerArea = Math.ceil(50 / COPENHAGEN_AREAS.length);

    for (const area of COPENHAGEN_AREAS) {
      for (let i = 0; i < ensemblesPerArea; i++) {
        // Generate ensemble with open positions
        const openPositions = faker.helpers.arrayElements(
          Object.values(Instrument),
          faker.number.int({ min: 1, max: 4 }),
        );

        const coords = generateNearbyCoordinates(area.latitude, area.longitude);
        const streetName = faker.helpers.arrayElement(area.streets);
        const streetNumber = faker.number.int({ min: 1, max: 150 });

        const ensemble = await Ensemble.create({
          name: `${faker.music.genre()} Ensemble ${area.name}`,
          description: "Created by seed script for testing purpose and is not a real ensemble",
          location: {
            city: "Copenhagen",
            country: "Denmark",
            address: `${streetName} ${streetNumber}`,
            coordinates: {
              type: "Point",
              coordinates: [coords.longitude, coords.latitude],
            },
          },
          open_positions: openPositions,
          is_active: true,
        });

        // Create host membership with an instrument not in open positions
        await EnsembleMembership.create({
          ensemble: ensemble._id,
          ensemble_id: ensemble._id.toString(),
          member: new mongoose.Types.ObjectId(hostUserId),
          member_id: hostUserId,
          is_host: true,
          instrument: getFilledPosition(openPositions),
        });

        console.log(`Created ensemble in ${area.name} at ${streetName} ${streetNumber}`);
      }
    }

    console.log("Successfully created ensembles across Copenhagen neighborhoods");
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
