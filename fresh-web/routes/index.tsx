import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { main as sagApp } from "../../app/main.ts"; 
import { GamePrediction } from "../../app/types/GamePrediction.ts"; 
import GamePredictions from "../components/GamePredictions.tsx";
import PageLayout from "../components/PageLayout.tsx";


export const handler: Handlers<GamePrediction[]> = {
  async GET(_, ctx) {
    const games = await sagApp({ week: 1 });

    return ctx.render(games);
  },
};

export default function Home({ data }: PageProps<GamePrediction[]>) {
  return (
    // <>
    //   <Head>
    //     <title>Fresh App 3 </title>
    //   </Head>
    //   <div class="p-4 mx-auto max-w-screen-md">
    //     <GamePredictions week={1} games={data} />     
    //   </div>
    // </>
    <PageLayout>
      <GamePredictions week={1} games={data} />
    </PageLayout>
  );
}
