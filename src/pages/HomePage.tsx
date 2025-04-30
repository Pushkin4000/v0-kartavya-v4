import { Link } from "react-router-dom"
import { ArrowRight, Package, Check, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageLayout from "@/components/layout/PageLayout"

export default function HomePage() {
  return (
    <PageLayout className="bg-white" hideHeader>
      {/* Hero section */}
      <div className="bg-gradient-to-b from-kartavya-light to-white">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Package className="h-8 w-8 text-kartavya-primary" strokeWidth={2} />
            <span className="ml-2 font-heading font-bold text-xl text-kartavya-dark">Kartavya</span>
          </Link>
          <div>
            <Button variant="ghost" asChild className="mr-2">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?tab=register">Get Started</Link>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-gray-900">
            Reducing Food Waste, <br />
            <span className="text-kartavya-primary">Feeding Communities</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Kartavya connects food businesses with NGOs to redistribute surplus food to those who need it most, creating
            a more sustainable food ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth?tab=register&type=provider">I'm a Food Provider</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth?tab=register&type=ngo">I'm an NGO</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">How Kartavya Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-kartavya-light flex items-center justify-center mb-6">
                <Package className="h-10 w-10 text-kartavya-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">List Surplus Food</h3>
              <p className="text-gray-600">
                Food providers list their surplus food with details like quantity, expiry date, and pickup instructions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-kartavya-light flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-kartavya-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">NGOs Browse & Order</h3>
              <p className="text-gray-600">
                NGOs browse available food listings, add items to cart, and schedule pickups that work with their
                schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-kartavya-light flex items-center justify-center mb-6">
                <Users className="h-10 w-10 text-kartavya-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Feed Communities</h3>
              <p className="text-gray-600">
                Food gets redistributed to people in need instead of going to waste, creating a positive impact on
                communities and the environment.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button size="lg" asChild>
              <Link to="/auth?tab=register">
                Join the Movement <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-6">Benefits of Using Kartavya</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            Our platform offers advantages for both food providers and NGOs while making a positive impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-kartavya-dark">Reduce Food Waste</h3>
              <p className="text-gray-600">
                Food providers can significantly reduce the amount of edible food that gets thrown away, contributing to
                sustainability goals.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-kartavya-dark">Support Communities</h3>
              <p className="text-gray-600">
                Help feed those in need by redirecting surplus food to NGOs that serve vulnerable populations in your
                community.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-kartavya-dark">Efficient Process</h3>
              <p className="text-gray-600">
                Our streamlined platform makes food donation simple with easy listing, scheduling, and coordination.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-kartavya-dark">Environmental Impact</h3>
              <p className="text-gray-600">
                Reducing food waste means less methane emissions from landfills and a lower carbon footprint for your
                business.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-kartavya-dark">Reliable Food Sources</h3>
              <p className="text-gray-600">
                NGOs gain access to diverse, reliable food sources to better serve their communities with nutritious
                options.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-kartavya-dark">Build Relationships</h3>
              <p className="text-gray-600">
                Create meaningful connections between food businesses and non-profits working toward common social
                goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-kartavya-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
            Join Kartavya today and be part of the movement to reduce food waste and support communities in need.
            Registration takes just a few minutes.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth?tab=register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  )
}
