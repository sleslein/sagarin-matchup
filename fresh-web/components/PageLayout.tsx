import { Head } from "$fresh/runtime.ts";

export default function ({ children }) {
   return(
    <>
        <Head>
            <title>Sagarin Matchup</title>
        </Head>
        <main class="p-4 mx-auto max-w-screen-md">
            {children}    
        </main>
    </>
   );
}