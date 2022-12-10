export function Link(
  { href, children }: { href: string; children: preact.ComponentChildren },
) {
  return (
    <a
      class="text-green-500 hover:underline visited:text-purple-500"
      href={href}
      target="_blank"
    >
      {children}
    </a>
  );
}
