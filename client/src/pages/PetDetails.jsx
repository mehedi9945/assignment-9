import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { 
  Heart, MapPin, DollarSign, Calendar, Info, 
  ShieldCheck, Activity, Mail, UserCheck, Clock 
} from 'lucide-react';

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  // Fetch pet details
  const { data: pet = {}, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/pets/${id}`);
      return res.data;
    },
  });

  // Adoption request mutation
  const adoptionMutation = useMutation({
    mutationFn: async (requestData) => {
      const res = await axiosSecure.post('/api/requests', requestData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Adoption request submitted successfully!');
      reset();
      queryClient.invalidateQueries(['pet', id]);
      navigate('/dashboard/my-requests');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    }
  });

  const onSubmit = (data) => {
    const requestData = {
      petId: id,
      userName: user.displayName || 'Adopter',
      pickupDate: data.pickupDate,
      message: data.message
    };
    adoptionMutation.mutate(requestData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-medium text-base-content/70 animate-pulse">
            Fetching companion information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !pet.name) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-base-content">Pet Details Not Found</h2>
        <p className="text-base-content/60">The pet companion listing you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/all-pets')} className="btn btn-primary rounded-xl">Back to All Pets</button>
      </div>
    );
  }

  const isOwner = pet.ownerEmail === user?.email;
  const isAdopted = pet.status === 'adopted';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image, Stats, Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Image */}
          <div className="relative h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-md border border-base-200 bg-base-200">
            <img 
              src={pet.imageUrl} 
              alt={pet.name} 
              className="w-full h-full object-cover"
            />
            {isAdopted && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="badge badge-success text-white font-bold px-6 py-4 rounded-xl text-lg shadow-lg">
                  Adopted & In a Happy Home
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-base-100/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full border border-base-200 text-primary">
              {pet.species}
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200/30 text-center">
              <span className="text-xs text-base-content/50 block font-semibold">Breed</span>
              <span className="text-sm font-bold text-base-content truncate block">{pet.breed}</span>
            </div>
            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200/30 text-center">
              <span className="text-xs text-base-content/50 block font-semibold">Age</span>
              <span className="text-sm font-bold text-base-content">{pet.age} {pet.age === 1 ? 'Year' : 'Years'}</span>
            </div>
            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200/30 text-center">
              <span className="text-xs text-base-content/50 block font-semibold">Gender</span>
              <span className="text-sm font-bold text-base-content capitalize">{pet.gender}</span>
            </div>
            <div className="bg-base-200/50 p-4 rounded-2xl border border-base-200/30 text-center">
              <span className="text-xs text-base-content/50 block font-semibold">Adoption Fee</span>
              <span className="text-sm font-bold text-primary">${pet.adoptionFee}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="card bg-base-100 border border-base-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-base-content">About {pet.name}</h2>
            <p className="text-base-content/75 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {pet.description || "No description provided."}
            </p>
          </div>

          {/* Health & Safety Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm flex flex-row items-center gap-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base-content">Health Status</h4>
                <p className="text-sm text-base-content/70">{pet.healthStatus || 'Not specified'}</p>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm flex flex-row items-center gap-4">
              <div className="p-3 bg-accent/10 text-accent rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base-content">Vaccination Status</h4>
                <p className="text-sm text-base-content/70">{pet.vaccinationStatus || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Owner Info & Location */}
          <div className="card bg-base-100 border border-base-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-base-content">Shelter / Owner Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-base-content/75">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>Contact Email: <span className="font-medium text-base-content">{pet.ownerEmail}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-base-content/75">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Location: <span className="font-medium text-base-content">{pet.location}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Adoption Request Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card bg-base-100 border border-base-200 p-6 rounded-3xl shadow-lg sticky top-24">
            <h3 className="font-bold text-xl text-base-content mb-4 flex items-center gap-2 border-b border-base-200 pb-3">
              <Heart className="h-5 w-5 text-primary" />
              <span>Adoption Request</span>
            </h3>

            {isAdopted ? (
              <div className="alert alert-success bg-success/10 text-success border-success/20 rounded-2xl p-4 flex flex-col gap-2 items-start text-sm">
                <div className="flex gap-2 items-center">
                  <UserCheck className="h-5 w-5 shrink-0" />
                  <span className="font-bold">Already Adopted!</span>
                </div>
                <p className="text-xs text-base-content/70">This companion has successfully found their new loving family.</p>
              </div>
            ) : isOwner ? (
              <div className="alert alert-info bg-primary/10 text-primary border-primary/20 rounded-2xl p-4 flex flex-col gap-2 items-start text-sm">
                <div className="flex gap-2 items-center">
                  <Info className="h-5 w-5 shrink-0" />
                  <span className="font-bold">Your Listing</span>
                </div>
                <p className="text-xs text-base-content/70">You are the owner of this pet companion listing. You cannot adopt your own listing.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Pet Name - Read Only */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-base-content/60">Companion Name</span>
                  </label>
                  <input 
                    type="text" 
                    value={pet.name} 
                    readOnly 
                    className="input input-bordered input-sm bg-base-200/50 rounded-lg text-sm text-base-content focus:outline-none" 
                  />
                </div>

                {/* User Name - Read Only */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-base-content/60">Adopter Name</span>
                  </label>
                  <input 
                    type="text" 
                    value={user?.displayName || ''} 
                    readOnly 
                    className="input input-bordered input-sm bg-base-200/50 rounded-lg text-sm text-base-content focus:outline-none" 
                  />
                </div>

                {/* User Email - Read Only */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-base-content/60">Adopter Email</span>
                  </label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    readOnly 
                    className="input input-bordered input-sm bg-base-200/50 rounded-lg text-sm text-base-content focus:outline-none" 
                  />
                </div>

                {/* Pickup Date - Datepicker */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-base-content/60">Proposed Pickup Date</span>
                  </label>
                  <input 
                    type="date" 
                    className={`input input-bordered input-sm rounded-lg text-sm focus:outline-primary ${errors.pickupDate ? 'input-error' : ''}`}
                    {...register('pickupDate', { 
                      required: 'Proposed pickup date is required',
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        return selectedDate >= today || 'Pickup date cannot be in the past';
                      }
                    })}
                  />
                  {errors.pickupDate && (
                    <span className="text-error text-[10px] mt-1">{errors.pickupDate.message}</span>
                  )}
                </div>

                {/* Message - Textarea */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-base-content/60">Message to Owner</span>
                  </label>
                  <textarea 
                    placeholder="Tell the shelter/owner why you'd be a perfect fit..."
                    className="textarea textarea-bordered rounded-lg text-sm h-24 focus:outline-primary"
                    {...register('message', { required: 'Please write a brief message' })}
                  />
                  {errors.message && (
                    <span className="text-error text-[10px] mt-1">{errors.message.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-block rounded-xl mt-4 font-bold shadow-md shadow-primary/10"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      Adopt {pet.name}
                      <Heart className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
