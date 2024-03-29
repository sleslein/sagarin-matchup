import { Handlers, PageProps } from "$fresh/server.ts";
import { main as sagApp } from "../../app/main.ts";
import { GamePrediction } from "../../app/types/GamePrediction.ts";
import GamePredictions from "../components/GamePredictions.tsx";
import PageLayout from "../components/PageLayout.tsx";

interface Props {
  week: number;
  games: GamePrediction[];
}

export const handler: Handlers<Props> = {
  async GET(_, ctx) {
    const { week } = ctx.params;
    const intWeek = parseInt(week);
    const games = await sagApp({ week: intWeek });

    return ctx.render({ week: intWeek, games });
  },
};

export default function Week(props: PageProps<Props>) {
  return (
    <PageLayout activePage="test">
      <GamePredictions week={props.data.week} games={props.data.games} />
    </PageLayout>
  );
}
