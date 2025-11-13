import { Search } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col items-center text-center">
          {/* Logo
          <div className="mb-3">
            <img
              src="/assets/Homigo.png"
              alt="Homigo Logo"
              className="h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 w-auto object-contain drop-shadow-2xl animate-fade-in-up mx-auto"
            />
          </div> */}

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight">
            Welcome to the #1 Residential Rental Platform in the Philippines!
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto animate-fade-in-delay leading-relaxed">
            Connecting students with verified, safe, and affordable housing across the nation
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-full shadow-2xl p-2 flex items-center hover:shadow-3xl transition-shadow duration-300">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 ml-3 md:ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by city, university, or neighborhood..."
                className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-gray-700 outline-none rounded-full placeholder:text-gray-400"
              />
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap hover:scale-105 transform">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
        </svg>
      </div>
    </div>
  )
}

export default HeroSection
