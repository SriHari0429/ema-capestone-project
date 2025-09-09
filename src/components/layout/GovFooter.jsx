export default function GovFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Emission Monitoring Authority (EMA)</p>
        <p>For official use only • Internal Government Portal</p>
      </div>
    </footer>
  );
}
