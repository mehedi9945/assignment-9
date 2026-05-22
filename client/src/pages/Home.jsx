import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import useAxiosPublic from '../hooks/useAxiosPublic';
import {
  Heart, Shield, Sparkles, Award, Users,
  MapPin, CheckCircle, ArrowRight, BookOpen, Clock
} from 'lucide-react';

// Fallback featured pets in case database is empty
const MOCK_PETS = [
  {
    _id: "mock1",
    name: "Bella",
    species: "Dog",
    breed: "Golden Retriever",
    location: "Seattle, WA",
    adoptionFee: 150,
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    age: 2,
  },
  {
    _id: "mock2",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    location: "Boston, MA",
    adoptionFee: 75,
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    age: 1,
  },
  {
    _id: "mock3",
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    location: "Austin, TX",
    adoptionFee: 120,
    imageUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=600",
    age: 3,
  },
  {
    _id: "mock4",
    name: "Oliver",
    species: "Cat",
    breed: "Tabby",
    location: "Denver, CO",
    adoptionFee: 60,
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600",
    age: 1,
  },
  {
    _id: "mock5",
    name: "Daisy",
    species: "Rabbit",
    breed: "Angora",
    location: "Chicago, IL",
    adoptionFee: 45,
    imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600",
    age: 1,
  },
  {
    _id: "mock6",
    name: "Max",
    species: "Dog",
    breed: "German Shepherd",
    location: "Miami, FL",
    adoptionFee: 180,
    imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=600",
    age: 4,
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch pets with TanStack Query
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['featuredPets'],
    queryFn: async () => {
      const res = await axiosPublic.get('/api/pets');
      return res.data;
    }
  });

  // Display top 6 pets (either fetched or mock fallback)
  const displayPets = pets.length > 0 ? pets.slice(0, 6) : MOCK_PETS;

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-base-100 py-20 lg:py-32 px-4 md:px-8 border-b border-base-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
              <Sparkles className="h-4 w-4" />
              <span>Meet Your New Best Friend Today</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-base-content">
              Find Lovable <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Companions
              </span> Near You
            </h1>
            <p className="text-lg text-base-content/75 max-w-xl mx-auto lg:mx-0">
              Thousands of sheltered animals are waiting for a loving home. We make the pet adoption process simple, secure, and transparent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/all-pets"
                className="btn btn-primary btn-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/35 group"
              >
                Adopt Now
                <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#why-adopt"
                className="btn btn-outline btn-lg rounded-2xl hover:bg-base-200"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-50 max-w-lg mx-auto"></div>
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800"
              alt="Cute dog looking for a home"
              className="rounded-3xl shadow-2xl border-4 border-base-100 max-w-md w-full object-cover aspect-[4/3] relative z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED PETS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">Featured Companions</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">
            Meet some of our lovely companions waiting for a warm home. Could you be their forever family?
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4 w-full">
                <div className="skeleton h-56 w-full rounded-2xl"></div>
                <div className="skeleton h-6 w-2/3"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-10 w-1/3 mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayPets.map((pet) => (
              <motion.div
                key={pet._id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
              >
                <figure className="relative h-56 w-full overflow-hidden">
                  <img
                    src={pet.imageUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-base-100/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full border border-base-200 text-primary">
                    {pet.species}
                  </div>
                </figure>
                <div className="card-body p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="card-title text-xl font-bold text-base-content">{pet.name}</h3>
                      <p className="text-sm text-base-content/60 font-medium">{pet.breed}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-base-content/50 block">Adoption Fee</span>
                      <span className="text-lg font-bold text-primary">${pet.adoptionFee}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/75 bg-base-200/50 p-2.5 rounded-xl">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{pet.location}</span>
                  </div>
                  <div className="card-actions pt-2">
                    <Link
                      to={`/pet/${pet._id}`}
                      className="btn btn-primary btn-block rounded-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link to="/all-pets" className="btn btn-outline btn-primary px-8 rounded-xl">
            View All Companions
          </Link>
        </div>
      </section>

      {/* 3. STATIC SECTION: WHY ADOPT */}
      <section id="why-adopt" className="bg-base-200/50 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-base-content">Why Adopt a Pet?</h2>
            <p className="text-base-content/70 leading-relaxed">
              Adoption is more than just getting a pet; it is saving a life. Over a million adoptable dogs and cats are euthanized each year in the US simply because too many pets come into shelters and too few people consider adoption.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">Unconditional Companionship</h4>
                  <p className="text-sm text-base-content/65">Pets bring joy, laughter, and an unparalleled level of loyalty and support to any home.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">Promotes Better Health</h4>
                  <p className="text-sm text-base-content/65">Walking dogs increases physical activity, and playing with pets decreases blood pressure and stress levels.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-xl shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">Supports Shelter Programs</h4>
                  <p className="text-sm text-base-content/65">Adopting leaves room for shelters to rescue more animals and supports ethical pet management practices.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400"
              alt="Playful dogs"
              className="rounded-2xl shadow-md object-cover h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&q=80&w=400"
              alt="Cute cat looking out"
              className="rounded-2xl shadow-md object-cover h-60 w-full mt-8"
            />
          </motion.div>
        </div>
      </section>

      {/* 4. CREATIVE SECTION: ADOPTION TIMELINE */}
      <section id="timeline" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">The Adoption Journey</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">
            A simple, transparent 4-step path to bringing your new companion home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-1 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2 z-0"></div>

          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl text-center space-y-4 relative z-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold text-lg mx-auto">1</div>
            <h3 className="font-bold text-lg text-base-content">Explore & Match</h3>
            <p className="text-sm text-base-content/70">Browse through our available pets, filter by species, and view their details to find a fit.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl text-center space-y-4 relative z-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary text-secondary-content rounded-full flex items-center justify-center font-bold text-lg mx-auto">2</div>
            <h3 className="font-bold text-lg text-base-content">Request Submission</h3>
            <p className="text-sm text-base-content/70">Click "Adopt Now", fill out the pickup date, add a custom note, and submit the request.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl text-center space-y-4 relative z-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent text-accent-content rounded-full flex items-center justify-center font-bold text-lg mx-auto">3</div>
            <h3 className="font-bold text-lg text-base-content">Owner Approval</h3>
            <p className="text-sm text-base-content/70">The pet listing owner reviews your profile, date, and message, and approves or rejects the request.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl text-center space-y-4 relative z-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-success text-success-content rounded-full flex items-center justify-center font-bold text-lg mx-auto">4</div>
            <h3 className="font-bold text-lg text-base-content">Pickup & Belong</h3>
            <p className="text-sm text-base-content/70">Once approved, coordinate the pickup, pay the adoption fee, and welcome your new pet home!</p>
          </div>
        </div>
      </section>

      {/* 5. STATIC SECTION: SUCCESS STORIES */}
      <section id="success-stories" className="bg-primary/5 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content">Success Stories</h2>
            <p className="text-base-content/60 max-w-lg mx-auto">
              Real stories of families who found joy and complete companionship through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                  alt="Sarah"
                  className="w-12 h-12 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-base-content">Sarah & Barnaby</h4>
                  <p className="text-xs text-base-content/50">Adopted a Beagle</p>
                </div>
              </div>
              <p className="text-sm text-base-content/70 italic leading-relaxed">
                "Barnaby has completed our household. The adoption request process was smooth, and the owner was very cooperative. He is healthy, active, and we love him to bits!"
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120"
                  alt="David"
                  className="w-12 h-12 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-base-content">David & Oliver</h4>
                  <p className="text-xs text-base-content/50">Adopted a Tabby Cat</p>
                </div>
              </div>
              <p className="text-sm text-base-content/70 italic leading-relaxed">
                "Oliver is the perfect study companion. He is calm, clean, and extremely cuddly. Highly recommend adopting through this platform to anyone seeking a companion."
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                  alt="Elena"
                  className="w-12 h-12 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-base-content">Elena & Pippin</h4>
                  <p className="text-xs text-base-content/50">Adopted an Angora Rabbit</p>
                </div>
              </div>
              <p className="text-sm text-base-content/70 italic leading-relaxed">
                "Finding Pippin was a dream. The dashboard statistics allowed me to track listings and requests instantly, and the responsive timeline put me completely at ease."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. STATIC SECTION: PET CARE TIPS */}
      <section id="care-tips" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">Essential Pet Care Tips</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">
            Practical knowledge for keeping your newly adopted companion healthy, active, and happy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl space-y-3 shadow-sm">
            <div className="text-primary"><BookOpen className="h-8 w-8" /></div>
            <h3 className="font-bold text-lg text-base-content">Balanced Nutrition</h3>
            <p className="text-sm text-base-content/70">Feed your pet high-quality food appropriate for their breed, age, and weight. Clean, fresh water must be available at all times.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl space-y-3 shadow-sm">
            <div className="text-primary"><Clock className="h-8 w-8" /></div>
            <h3 className="font-bold text-lg text-base-content">Regular Vet Checkups</h3>
            <p className="text-sm text-base-content/70">Ensure annual checkups, up-to-date vaccinations, and routine preventative care for fleas, ticks, and worms. Spaying/neutering is essential.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl space-y-3 shadow-sm">
            <div className="text-primary"><Heart className="h-8 w-8" /></div>
            <h3 className="font-bold text-lg text-base-content">Mental & Physical Play</h3>
            <p className="text-sm text-base-content/70">Regular exercise keeps pets healthy and prevents destructive behavior. Cats require scratch posts and toys, while dogs need active walks.</p>
          </div>
        </div>
      </section>

      {/* 7. CREATIVE SECTION: MEET VOLUNTEERS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">Meet Our Dedicated Volunteers</h2>
          <p className="text-base-content/60 max-w-lg mx-auto">
            The passionate animal lovers who make our rescue and adoption work possible every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden text-center p-6 space-y-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              alt="Clara"
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-primary/20"
            />
            <div>
              <h4 className="font-bold text-base-content text-lg">Clara Jenkins</h4>
              <p className="text-xs text-primary font-semibold">Adoption Coordinator</p>
            </div>
            <p className="text-xs text-base-content/70">Assists families in filling details and matching with suitable pet profiles.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden text-center p-6 space-y-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              alt="Marcus"
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-secondary/20"
            />
            <div>
              <h4 className="font-bold text-base-content text-lg">Marcus Vance</h4>
              <p className="text-xs text-secondary font-semibold">Shelter Veterinarian</p>
            </div>
            <p className="text-xs text-base-content/70">Performs health checkups, certifies vaccinations, and monitors pet health status.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden text-center p-6 space-y-3">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
              alt="Evelyn"
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-accent/20"
            />
            <div>
              <h4 className="font-bold text-base-content text-lg">Evelyn Shaw</h4>
              <p className="text-xs text-accent font-semibold">Behavioral Specialist</p>
            </div>
            <p className="text-xs text-base-content/70">Ensures dogs and cats develop positive traits and adjust to home settings.</p>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm rounded-2xl overflow-hidden text-center p-6 space-y-3">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
              alt="Liam"
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-success/20"
            />
            <div>
              <h4 className="font-bold text-base-content text-lg">Liam O'Connor</h4>
              <p className="text-xs text-success font-semibold">Groomer & Caretaker</p>
            </div>
            <p className="text-xs text-base-content/70">Maintains grooming standards, exercises animals, and manages pickup logistics.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
