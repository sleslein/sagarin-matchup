export default function Card( { className, children }) {
   return (
        <div class={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
            {children}    
        </div>
    );
}