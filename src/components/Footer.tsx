export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TaskManager Pro. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}