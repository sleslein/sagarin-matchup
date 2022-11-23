import { PageProps, Handlers } from "$fresh/server.ts";
import { main as sagApp } from "../../app/main.ts"; 
import { GamePrediction } from "../../app/types/GamePrediction.ts"; 
import GamePredictions from "../components/GamePredictions.tsx";
import PageLayout from "../components/PageLayout.tsx";

export const handler: Handlers<GamePrediction[]> = {
  async GET(_, ctx) {
    const { week } = ctx.params;
    const intWeek = parseInt(week);
    const games = await sagApp({ week: intWeek });

    return ctx.render(games);
  },
};

export default function Week(props: PageProps) {
  return (
    <PageLayout activeWeek={parseInt(props.params.week)}>
      <GamePredictions week={props.params.week} games={props.data} />      
    </PageLayout>
  );
}
