import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { dehydrate } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { trpc } from "~/trpc";

export async function loader({ context }: LoaderFunctionArgs) {
  void context.trpc.reviews.prefetch({ productSlug: "cheese" });

  await context.trpc.product.prefetch({ slug: "cheese" });

  return {
    dehydratedState: dehydrate(context.queryClient),
  };
}

export const meta: MetaFunction = () => {
  return [
    { title: "Some cheese" },
    { name: "description", content: "It's Cheese init" },
  ];
};

function Price({
  price,
}: { price: { value: number; currency: string; fractionalDigits: number } }) {
  const value = price.value / 10 ** price.fractionalDigits;

  const str = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(value);

  return (
    <>
      {str} {price.currency}
    </>
  );
}

function ProductReviews({ slug }: { slug: string }) {
  const [reviews] = trpc.reviews.useSuspenseQuery({ productSlug: slug });

  return (
    <div className="grid sm:grid-cols-2 gap-8">
      {reviews.map((review) => {
        return (
          <div key={review.reviewer.name} className="col-span-1">
            <p className="font-bold">{review.reviewer.name}</p>
            <p>
              Rating: <strong>{review.rating}</strong>
            </p>
            <p>{review.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function Product({ slug }: { slug: string }) {
  const [product] = trpc.product.useSuspenseQuery({ slug });

  return (
    <div className="bg-gray-800 p-8 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">{product.title}</h1>

      <p className="my-3 font-bold text-lg">
        <Price price={product.price} />
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="col-span-1">
          <img src={product.image.url} width={300} alt={product.title} />
        </div>

        <div className="col-span-1">
          <p>{product.description}</p>
        </div>
      </div>

      <h2 className="font-bold text-xl my-6">Reviews</h2>

      <Suspense fallback={<p>Loading reviews for {product.title}</p>}>
        <ProductReviews slug={slug} />
      </Suspense>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>Count: {count}</div>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Add
      </button>
    </div>
  );
}

export default function Index() {
  return (
    <div className="max-w-[800px] mx-auto p-2">
      <Counter />
      <Product slug="cheese" />
    </div>
  );
}
