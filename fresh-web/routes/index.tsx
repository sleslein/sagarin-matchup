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
    <PageLayout activeWeek={1}>
      <GamePredictions week={1} games={data} />
    </PageLayout>
  );
}
