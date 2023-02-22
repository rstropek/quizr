import SelectCity from "./selectCity/page";

// Note that this is a server component (RSA, React Server Component).
// Read more about RSAs at https://beta.nextjs.org/docs/rendering/server-and-client-components#why-server-components.

export default async function Home() {
  // We fetch the list of cities for which we have quizzes on the server.
  // The client should never see the backend API that we are using. In real world,
  // we might need e.g. a specific API key to access the backend API. That
  // key should never be exposed to the client.
  const citiesResponse = await fetch(
    `${process.env.SERVICE_BASE_URL!}/quizzes/cities`
  );
  const cities = (await citiesResponse.json()) as string[];

  // City selection is an interactive component. It is rendered on the client.
  return <SelectCity cities={cities}></SelectCity>;
}
