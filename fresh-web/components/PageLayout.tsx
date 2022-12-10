import { Head } from "$fresh/runtime.ts";
import { Link } from "./Link.tsx";

export default function (
  { activePage, children }: { activePage: string; children: Preact.Node },
) {
  return (
    <body class="bg-gray-100 grid grid-cols-1 grid-rows-layout min-h-screen">
      <Head>
        <title>Sagarin Matchup</title>
      </Head>
      <Header activePage={activePage} />
      <main class="p-4 flex-grow">
        {children}
      </main>
      <Footer />
    </body>
  );
}

function Header({ activePage }: { activePage: string }) {
  return (
    <nav class="bg-white p-5 shadow-lg">
      <ul class="flex gap-3">
        <li className="uppercase">Sagarin Match Up</li>
        <NavItem active={activePage !== "about"} href="/">Predictions</NavItem>
        <NavItem active={activePage === "about"} href="about">About</NavItem>
      </ul>
    </nav>
  );
}

function NavItem(
  { active, children, className, href }: {
    active: boolean;
    href: string;
    children: Preact.Node;
    className: string;
  },
) {
  const baseClass = "py-1 px-1 rounded-full sm:px-5";
  const activeClass = "bg-green-500 text-green-50";
  const hoverClass = "hover:bg-green-500 hover:text-green-50";

  return (
    <li>
      <a
        href={href}
        class={`${baseClass} ${className} ${hoverClass} ${
          active && activeClass
        } `}
      >
        {children}
      </a>
    </li>
  );
}

function Footer() {
  return (
    <footer class="bg-white p-3 border border-t-grey-300">
      <div class="mx-auto max-w-min">
        <Link href="https://github.com/sleslein/sagarin-matchup">Source</Link>
      </div>
    </footer>
  );
}
