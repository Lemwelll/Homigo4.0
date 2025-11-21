import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import UserTypeCard from '../components/UserTypeCard'
import { Home, Building2, Shield, Star, Users, CheckCircle } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* How Can We Help Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          How can we help you?
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <UserTypeCard
            icon={Home}
            title="I'm looking for a rent"
            description="Find verified, safe, and affordable student housing near your university"
            link="/student/register"
            gradient="bg-gradient-to-br from-primary-500 to-primary-600"
          />

          <UserTypeCard
            icon={Building2}
            title="I want to post my rental property"
            description="List your property and connect with verified students looking for housing"
            link="/landlord/register"
            gradient="bg-gradient-to-br from-secondary-500 to-secondary-600"
          />
        </div>

        <div className="text-center">
          <Link to="/student/dashboard" className="text-primary-500 hover:text-primary-600 font-semibold underline">
            Skip onboarding
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Homigo?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Properties</h3>
              <p className="text-gray-600">All properties and landlords are verified for your safety</p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Listings</h3>
              <p className="text-gray-600">Curated selection of student-friendly accommodations</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Community</h3>
              <p className="text-gray-600">Join thousands of students and landlords nationwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Homigo</h3>
              <p className="text-gray-400">The #1 residential rental platform in the Philippines</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/student/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/student/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Landlords</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/landlord/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/landlord/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Homigo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
