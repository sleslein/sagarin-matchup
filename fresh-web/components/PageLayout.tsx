import { Head } from "$fresh/runtime.ts";

export default function ({ activePage, children }: { activePage: string; children: Preact.Node }) {
   return(
    <body class="bg-gray-100">
        <Head>
            <title>Sagarin Matchup</title>
        </Head>
        <Header activePage={activePage} />
        <main class="p-4">
            {children}    
        </main>
    </body>
   );
}

function Header({ activePage }: { activePage: string}) {
    const baseClass = "py-1 px-2 rounded-full";

    return (<nav class="bg-white p-5 shadow-lg">
        <ul class="flex gap-3">
            <li>Sagarin Match Up</li>
            <NavItem active={activePage !== 'about'} href="/">Predictions</NavItem>
            <NavItem active={activePage === 'about'} href="about">About</NavItem>
        </ul>
    </nav>);
}

function NavItem({ active, children, href }: { active: boolean; href: string; children: Preact.Node; }) {
    const baseClass = "py-1 px-5 rounded-full";
    const activeClass = "bg-green-500 text-green-50"
    return <li class={`${baseClass} ${active && activeClass}`}><a href={href}>{children}</a></li>;
}


