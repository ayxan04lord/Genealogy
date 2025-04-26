import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Логотип */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png" // Положи сюда своё изображение
            alt="Logo"
            className="h-10 w-10 object-cover"
          />
          <span className="text-xl font-bold text-gray-800">
            Azərbaycan Genealogiya Platforması
          </span>
        </div>

        {/* Навигация */}
        <nav className="space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-green-600 transition font-medium"
          >
            Ana səhifə
          </Link>
          <Link
            to="/tree"
            className="text-gray-700 hover:text-green-600 transition font-medium"
          >
            Soy ağacı
          </Link>
        </nav>
      </div>
    </header>
  );
}
