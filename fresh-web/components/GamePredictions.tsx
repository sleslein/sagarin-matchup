import { GamePrediction } from "../../app/types/GamePrediction.ts";
import { Game } from "../../app/types/Game.ts";


export interface GamePredictionProps {
    week: number;
    games: GamePrediction[];
}

export default function GamePredictions({ week, games}: GamePredictionProps) {
    return (
        <>
            <h1 class="text-3xl hidden h-0">Week {week}</h1>
            <ul class="flex flex-col gap-5">
                <GameContainer className="border-b-2 font-bold">
                    <GameCell>Home</GameCell> 
                    <span>@</span> 
                    <GameCell>Away</GameCell>
                    <GameCell>Predicted Winner</GameCell>
                </GameContainer>

                {games.map((game: GamePrediction) => {
                    return <Game game={game} />
                })}
            </ul>
        </>
    );
}


function Game({ game }: { game: GamePrediction }){
    const awayWinner = game.calcScore < 0;
    return (
        <GameContainer>
            <GameCell isWinner={awayWinner}>{game.away}({game.awayRatings.avg})</GameCell> 
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
    return <li class={`grid grid-cols-game-grid gap-5 justify-items-stretch ${className}`}>{children}</li>
}

function GameCell({ isWinner, children}: { isWinner: boolean; children: Preact.Node }){
    const classNames = ['text-center py-0.5 px-1 rounded-md', isWinner ? 'font-bold bg-green-100' : undefined];
    return <span class={classNames.join(" ")}>{children}</span>
}