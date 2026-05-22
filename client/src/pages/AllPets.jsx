import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAuth from '../hooks/useAuth';
import { Search, SlidersHorizontal, MapPin, DollarSign, Calendar, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];

const AllPets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  
  // Search, Filter, Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  // Fetch pets with query parameters
  const { data: pets = [], isLoading, error } = useQuery({
    queryKey: ['pets', searchTerm, selectedSpecies, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSpecies.length > 0) {
        params.append('species', selectedSpecies.join(','));
      }
      if (sortBy) params.append('sortBy', sortBy);

      const res = await axiosPublic.get(`/api/pets?${params.toString()}`);
      return res.data;
    },
  });

  const handleSpeciesToggle = (species) => {
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species]
    );
  };

  const handleAdoptClick = (petId) => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: { pathname: `/pet/${petId}` } } });
    } else {
      navigate(`/pet/${petId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-base-content">Find Your Companion</h1>
        <p className="text-base-content/65 max-w-xl">
          Search, filter, and sort through our database of loving animals ready to join your family.
        </p>
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg text-base-content border-b border-base-200 pb-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <span>Filters</span>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="label-text font-bold text-base-content">Search by Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search pets..."
                className="input input-bordered w-full pl-10 rounded-xl focus:outline-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
            </div>
          </div>

          {/* Filter by Species */}
          <div className="space-y-3">
            <label className="label-text font-bold text-base-content block">Filter by Species</label>
            <div className="space-y-2">
              {SPECIES_OPTIONS.map((species) => (
                <label key={species} className="flex items-center gap-3 cursor-pointer select-none text-sm font-medium">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm rounded-md"
                    checked={selectedSpecies.includes(species)}
                    onChange={() => handleSpeciesToggle(species)}
                  />
                  <span className="text-base-content/85">{species}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedSpecies.length > 0) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecies([]);
              }}
              className="btn btn-outline btn-error btn-sm btn-block rounded-xl"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Pet Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-base-100 border border-base-200 p-4 rounded-2xl gap-4">
            <p className="text-sm font-medium text-base-content/70">
              Showing <span className="font-bold text-primary">{pets.length}</span> companions
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-base-content/60 shrink-0 font-medium">Sort by:</span>
              <select
                className="select select-bordered select-sm rounded-xl focus:outline-primary w-full sm:w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest Added</option>
                <option value="fee-asc">Adoption Fee (Low to High)</option>
                <option value="fee-desc">Adoption Fee (High to Low)</option>
                <option value="age-asc">Age (Youngest First)</option>
                <option value="age-desc">Age (Oldest First)</option>
              </select>
            </div>
          </div>

          {/* Grid Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col gap-4 w-full bg-base-100 border border-base-200 p-4 rounded-2xl">
                  <div className="skeleton h-48 w-full rounded-xl"></div>
                  <div className="skeleton h-6 w-2/3"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-10 w-full mt-2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-base-100 border border-base-200 rounded-3xl space-y-4">
              <p className="text-error font-medium">Failed to load pets database. Please try again later.</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-20 bg-base-100 border border-base-200 rounded-3xl space-y-4">
              <h3 className="text-xl font-bold text-base-content">No Pets Found</h3>
              <p className="text-sm text-base-content/60 max-w-sm mx-auto">
                No companions matched your criteria. Try adjusting your search term or species filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <motion.div
                  key={pet._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="card bg-base-100 border border-base-200 hover:shadow-xl rounded-2xl overflow-hidden group transition-all duration-300"
                >
                  <figure className="relative h-48 overflow-hidden bg-base-200">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-base-100/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full border border-base-200 text-primary">
                      {pet.species}
                    </div>
                    {pet.status === 'adopted' && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="badge badge-success text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow">
                          Adopted
                        </span>
                      </div>
                    )}
                  </figure>
                  
                  <div className="card-body p-5 space-y-4">
                    <div>
                      <h3 className="card-title text-lg font-bold text-base-content truncate">{pet.name}</h3>
                      <p className="text-xs text-base-content/50 font-semibold">{pet.breed}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-base-content/70">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{pet.age} {pet.age === 1 ? 'Year' : 'Years'} Old</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-base-content/70 justify-end">
                        <DollarSign className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-semibold text-primary">Fee: ${pet.adoptionFee}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-base-content/70 bg-base-200/50 p-2 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{pet.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => navigate(`/pet/${pet._id}`)}
                        className="btn btn-outline btn-sm rounded-xl font-bold flex items-center justify-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                      <button
                        onClick={() => handleAdoptClick(pet._id)}
                        disabled={pet.status === 'adopted'}
                        className="btn btn-primary btn-sm rounded-xl font-bold flex items-center justify-center gap-1"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        Adopt Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPets;
