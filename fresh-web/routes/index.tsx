import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { main as sagApp } from "../../app/main.ts"; 
import { GamePrediction } from "../../app/types/GamePrediction.ts"; 


export const handler: Handlers<GamePrediction[]> = {
  async GET(_, ctx) {
    const { username } = ctx.params;
    //const resp = await fetch(`https://api.github.com/users/${username}`);
    const games = await sagApp({week: 5});

    // if (resp.status === 404) {
    //   return ctx.render(null);
    // }
    // const user: User = await resp.json();
    return ctx.render(games);
  },
};

export default function Home({data}: PageProps<GamePrediction[]>) {
  return (
    <>
      <Head>
        <title>Fresh App 3 </title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
          file, and refresh.
        </p>
        <p>
          {
            JSON.stringify(data)
          }
        </p>
      </div>
    </>
  );
}
