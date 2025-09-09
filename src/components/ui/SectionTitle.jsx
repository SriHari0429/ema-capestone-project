export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl text-gov-navy">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}
