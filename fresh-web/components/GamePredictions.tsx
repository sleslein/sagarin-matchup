import { GamePrediction } from "../../app/types/GamePrediction.ts";
import { Game } from "../../app/types/Game.ts";


export interface GamePredictionProps {
    week: number;
    games: GamePrediction[];
}

export default function GamePredictions({ week, games}: GamePredictionProps) {
    return (
        <>
            <h1>Week {week}</h1>
            <ul>
                {games.map((game: GamePrediction) => {
                    return <Game game={game} />
                })}
            </ul>
        </>
    );
}

function Game({ game }: { game: GamePrediction }){
    return (<li>{game.away} ({game.awayRatings.avg}) @ {game.home} ({game.homeRatings.avg})</li>);
}