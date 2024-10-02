import { Faker, en } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createCallerFactory, publicProcedure, router } from "./trpc";

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const appRouter = router({
  product: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;

      await wait(500);

      if (input.slug !== "cheese") {
        new TRPCError({
          message: "Product Not Found",
          code: "NOT_FOUND",
        });
      }

      return {
        slug: "cheese",
        title: "The Best Cheese, In The World",
        description:
          "Cheese slices queso danish fontina. The big cheese cheesy grin cheddar stinking bishop roquefort cut the cheese cheesy feet cheese strings. Brie pecorino fondue st. agur blue cheese camembert de normandie airedale camembert de normandie danish fontina. Fromage cauliflower cheese roquefort fromage frais halloumi smelly cheese cow.\n\nMonterey jack say cheese pepper jack. Edam monterey jack queso caerphilly say cheese ricotta chalk and cheese cream cheese. Pepper jack stinking bishop croque monsieur cheeseburger cheeseburger cow cut the cheese danish fontina. Stilton.",
        image: {
          url: "/cheese.jpg",
        },
        price: {
          currency: "USD",
          value: 1450,
          fractionalDigits: 2,
        },
      };
    }),
  reviews: publicProcedure
    .input(
      z.object({
        productSlug: z.string(),
        limit: z.number().default(10),
        page: z.number().default(1),
      }),
    )
    .query(async (opts) => {
      const { input } = opts;

      await wait(1000);

      const faker = new Faker({
        locale: en,
      });

      if (input.productSlug !== "cheese") {
        new TRPCError({
          message: "Product Not Found",
          code: "NOT_FOUND",
        });
      }

      faker.seed(input.page);

      return Array.from({ length: opts.input.limit }, () => {
        return {
          reviewer: {
            name: faker.person.fullName(),
          },
          rating: faker.number.int({ min: 1, max: 5 }),
          text: faker.lorem.paragraph(),
        };
      });
    }),
});

export const createCaller = createCallerFactory(appRouter);
