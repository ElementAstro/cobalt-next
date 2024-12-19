export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">HTTP Test Client</h1>
          <nav className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-200 transition-colors">
              首页
            </a>
            <a href="#" className="hover:text-blue-200 transition-colors">
              文档
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

