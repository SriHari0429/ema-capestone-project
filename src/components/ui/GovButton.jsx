export default function GovButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        rounded-lg px-5 py-2.5
        font-medium tracking-wide
        bg-gov-secondary text-white
        hover:bg-gov-primary
        focus:ring-2 focus:ring-gov-accent focus:outline-none
        transition-all duration-200 shadow-sm
        ${className}
      `}
    >
      {children}
    </button>
  );
}
