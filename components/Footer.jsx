export default function Footer() {
  return (
    <footer className="border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-200 flex items-center justify-between">
        <div>© {new Date().getFullYear()} Dixon 3D</div>
        <div className="flex gap-4">
          <a href="/design" className="hover:underline">Get a quote</a>
          <a href="/shop" className="hover:underline">Shop</a>
          <a href="/" className="hover:underline">Home</a>
        </div>
      </div>
    </footer>
  );
}
