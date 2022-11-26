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

    return (<nav class="bg-white p-5 shadow-lg">
        <ul class="flex gap-3">
            <NavItem className="uppercase">Sagarin Match Up</NavItem>
            <NavItem active={activePage !== 'about'} href="/">Predictions</NavItem>
            <NavItem active={activePage === 'about'} href="about">About</NavItem>
        </ul>
    </nav>);
}

function NavItem({ active, children, className, href }: { active: boolean; href: string; children: Preact.Node; className: string }) {
    const baseClass = "py-1 px-1 rounded-full sm:px-5";
    const activeClass = "bg-green-500 text-green-50"
    return <li class={`${baseClass} ${className} ${active && activeClass}`}><a href={href}>{children}</a></li>;
}


