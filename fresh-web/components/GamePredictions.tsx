import { GamePrediction } from "../../app/types/GamePrediction.ts";
import { Game } from "../../app/types/Game.ts";
import Card from "../components/Card.tsx";
import WeekSelection from "../islands/WeekSelection.tsx";


export interface GamePredictionProps {
    week: number;
    games: GamePrediction[];
}

export default function GamePredictions({ week, games}: GamePredictionProps) {
    let pts = games.length + 1; // Add one extra to account for decrement in map below
    return (
        <Card className="max-w-md mx-auto">
            <h1 class="text-3xl hidden h-0">Week {week}</h1>
            <WeekSelection value={week} />
            <ul class="flex flex-col gap-5">
                <GameContainer className="border-b-2 font-bold">
                    <GameCell>Pts</GameCell> 
                    <GameCell>Home</GameCell> 
                    <span>@</span> 
                    <GameCell>Away</GameCell>
                    <GameCell>Predicted Winner</GameCell>
                </GameContainer>

                {games.map((game: GamePrediction) => {
                    pts -= 1; // decrement pts
                    return <Game game={game} pts={pts} />
                })}
            </ul>
        </Card>
    );
}


function Game({ game, pts }: { game: GamePrediction, pts: number }){
    const awayWinner = game.calcScore < 0;
    return (
        <GameContainer>
            <GameCell>{pts}</GameCell> 
            <GameCell isWinner={awayWinner}>{game.away} ({game.awayRatings.avg})</GameCell> 
            <span>@</span> 
            <GameCell isWinner={!awayWinner}>
                {game.home} ({game.homeRatings.avg})
            </GameCell>
            <GameCell>
                {game.predictedWinner} ({game.calcScore.toFixed(2)})
            </GameCell>
        </GameContainer>
    );
}

function GameContainer({children, className}: { className:string | undefined; children: Preact.Node; }) {
    return <li class={`grid grid-cols-game-grid gap-5 justify-items-stretch items-center ${className}`}>{children}</li>
}

function GameCell({ isWinner, children }: { isWinner: boolean; children: Preact.Node }){
    const classNames = ['text-center py-0.5 px-1 rounded-md', isWinner ? 'font-bold bg-green-100' : undefined];
    return <span class={classNames.join(" ")}>{children}</span>
}