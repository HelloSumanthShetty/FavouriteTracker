import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log(" Seeding database...");

  for (let i = 0; i < 30; i++) {
    await prisma.entry.create({
      data: {
        title: faker.commerce.productName(),
        type: faker.helpers.arrayElement(["MOVIE"]),
        director: faker.person.fullName(),
        budget: `$${faker.number.int({ min: 10, max: 500 })}M`,
        location: faker.location.city(),
        duration: `${faker.number.int({ min: 90, max: 200 })} min`,
        yearOrTime: faker.date
          .past({ years: 20 })
          .getFullYear()
          .toString(),
      },
    });
  }

  console.log("✅ Seeding done!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
