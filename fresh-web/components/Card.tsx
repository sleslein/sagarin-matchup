export default function Card(
  { className, children }: {
    className?: string;
    children: preact.ComponentChildren;
  },
) {
  return (
    <div class={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
}
