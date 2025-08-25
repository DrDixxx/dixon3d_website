export default function Footer() {
  return (
    <footer className="border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-200 flex items-center justify-between relative">
        <div>© {new Date().getFullYear()} Dixon 3D</div>
        <div className="flex gap-4">
          <a href="/design" className="hover:underline">Get a quote</a>
          <a href="/shop" className="hover:underline">Shop Items</a>
          <a href="/" className="hover:underline">Home</a>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-xs text-slate-400">Enhanced with GPT-5</div>
      </div>
    </footer>
  );
}
