export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm font-medium text-neutral-900">TravelBook</p>
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} TravelBook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
