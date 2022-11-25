import { Head } from "$fresh/runtime.ts";

export default function ({ activeWeek, children }: { activeWeek: number; children: Preact.Node }) {
   return(
    <body class="bg-gray-100">
        <Head>
            <title>Sagarin Matchup</title>
        </Head>
        <div class="flex p-4 gap-4">
            <WeeklyNav activeWeek={activeWeek} />
            <main class="bg-white rounded-lg shadow-lg p-4">
                {children}    
            </main>
        </div>
    </body>
   );
}

function WeeklyNav({ activeWeek }: { activeWeek: number }) {
    const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
    return (
        <nav class="w-max">
            <ul>
                {weeks.map((week) => {
                    return <WeeklyNavItem week={week} active={activeWeek === week} />;
                })}
            </ul>   
        </nav>
    )
}
function WeeklyNavItem({ week, active }: { week: number; active: boolean}) {
    const activeClass = active ? 'font-bold bg-white border-r-4 shadow-sm border-green-500' : undefined;
    const hoverClass = 'hover:bg-white hover:font-bold hover:border-r-4 hover:border-green-500 hover:shadow-sm';
    const className = `py-0.5 px-5 my-1 rounded ${hoverClass} ${activeClass}`;
    return <li class={className}><a href={week}>Week {week}</a></li>
}