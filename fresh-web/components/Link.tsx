export function Link ({ href, children}) {
    return (
        <a 
            class="text-green-500 hover:underline visited:text-purple-500" 
            href={href}
            target="_blank">
                {children}
        </a>
    )
}