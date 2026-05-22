import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import toast from 'react-hot-toast';
import { Edit3, FileText, Settings, Heart } from 'lucide-react';
import { useEffect } from 'react';

const EditPet = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch current pet data
  const { data: pet = {}, isLoading, error } = useQuery({
    queryKey: ['editPet', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/pets/${id}`);
      return res.data;
    },
  });

  // Pre-populate form once pet data loads
  useEffect(() => {
    if (pet && pet.name) {
      // Validate owner
      if (pet.ownerEmail !== user?.email) {
        toast.error('Unauthorized access to edit this listing.');
        navigate('/dashboard/my-listings');
        return;
      }
      // Populate fields
      setValue('name', pet.name);
      setValue('species', pet.species);
      setValue('breed', pet.breed);
      setValue('age', pet.age);
      setValue('gender', pet.gender);
      setValue('adoptionFee', pet.adoptionFee);
      setValue('imageUrl', pet.imageUrl);
      setValue('healthStatus', pet.healthStatus);
      setValue('vaccinationStatus', pet.vaccinationStatus);
      setValue('location', pet.location);
      setValue('description', pet.description);
    }
  }, [pet, user, setValue, navigate]);

  // Update Mutation
  const updatePetMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.put(`/api/pets/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Pet companion details updated successfully!');
      queryClient.invalidateQueries(['myListings']);
      queryClient.invalidateQueries(['pets']);
      queryClient.invalidateQueries(['pet', id]);
      navigate('/dashboard/my-listings');
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update pet listing.');
    }
  });

  const onSubmit = (data) => {
    updatePetMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !pet.name) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-base-content">Listing Not Found</h2>
        <button onClick={() => navigate('/dashboard/my-listings')} className="btn btn-primary rounded-xl">
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-base-300 pb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Edit3 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-base-content">Edit Pet Companion Details</h1>
          <p className="text-sm text-base-content/60">Update information for {pet.name}</p>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2 border-b border-base-200 pb-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Pet Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bella"
                  className={`input input-bordered rounded-xl focus:outline-primary ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Pet name is required' })}
                />
                {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
              </div>

              {/* Species */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Species</span>
                </label>
                <select
                  className={`select select-bordered rounded-xl focus:outline-primary ${errors.species ? 'select-error' : ''}`}
                  {...register('species', { required: 'Species is required' })}
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
                {errors.species && <span className="text-error text-xs mt-1">{errors.species.message}</span>}
              </div>

              {/* Breed */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Breed</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Golden Retriever"
                  className={`input input-bordered rounded-xl focus:outline-primary ${errors.breed ? 'input-error' : ''}`}
                  {...register('breed', { required: 'Breed is required' })}
                />
                {errors.breed && <span className="text-error text-xs mt-1">{errors.breed.message}</span>}
              </div>

              {/* Age */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Age (in Years)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 2"
                  className={`input input-bordered rounded-xl focus:outline-primary ${errors.age ? 'input-error' : ''}`}
                  {...register('age', { 
                    required: 'Age is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Age cannot be negative' }
                  })}
                />
                {errors.age && <span className="text-error text-xs mt-1">{errors.age.message}</span>}
              </div>

              {/* Gender */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  className={`select select-bordered rounded-xl focus:outline-primary ${errors.gender ? 'select-error' : ''}`}
                  {...register('gender', { required: 'Gender is required' })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && <span className="text-error text-xs mt-1">{errors.gender.message}</span>}
              </div>

              {/* Adoption Fee */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Adoption Fee ($)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 150"
                  className={`input input-bordered rounded-xl focus:outline-primary ${errors.adoptionFee ? 'input-error' : ''}`}
                  {...register('adoptionFee', { 
                    required: 'Adoption fee is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Fee cannot be negative' }
                  })}
                />
                {errors.adoptionFee && <span className="text-error text-xs mt-1">{errors.adoptionFee.message}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Health & Location */}
          <div className="space-y-4 pt-4 border-t border-base-200">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2 border-b border-base-200 pb-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Health & Location Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image URL */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Image URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className={`input input-bordered rounded-xl focus:outline-primary ${errors.imageUrl ? 'input-error' : ''}`}
                  {...register('imageUrl', { 
                    required: 'Pet image URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Invalid URL format',
                    }
                  })}
                />
                {errors.imageUrl && <span className="text-error text-xs mt-1">{errors.imageUrl.message}</span>}
              </div>

              {/* Health Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Health Status</span>
                </label>
                <select
                  className={`select select-bordered rounded-xl focus:outline-primary ${errors.healthStatus ? 'select-error' : ''}`}
                  {...register('healthStatus', { required: 'Health status is required' })}
                >
                  <option value="">Select Health Status</option>
                  <option value="Healthy & Active">Healthy & Active</option>
                  <option value="Minor Treatment Underway">Minor Treatment Underway</option>
                  <option value="Recovered & Fit">Recovered & Fit</option>
                  <option value="Requires Special Care">Requires Special Care</option>
                </select>
                {errors.healthStatus && <span className="text-error text-xs mt-1">{errors.healthStatus.message}</span>}
              </div>

              {/* Vaccination Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Vaccination Status</span>
                </label>
                <select
                  className={`select select-bordered rounded-xl focus:outline-primary ${errors.vaccinationStatus ? 'select-error' : ''}`}
                  {...register('vaccinationStatus', { required: 'Vaccination status is required' })}
                >
                  <option value="">Select Vaccination Status</option>
                  <option value="Fully Vaccinated">Fully Vaccinated</option>
                  <option value="Partially Vaccinated">Partially Vaccinated</option>
                  <option value="Not Vaccinated">Not Vaccinated</option>
                </select>
                {errors.vaccinationStatus && <span className="text-error text-xs mt-1">{errors.vaccinationStatus.message}</span>}
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Seattle, WA"
                  className={`input input-bordered rounded-xl focus:outline-primary ${errors.location ? 'input-error' : ''}`}
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && <span className="text-error text-xs mt-1">{errors.location.message}</span>}
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-4 pt-4 border-t border-base-200">
            <h3 className="font-bold text-lg text-base-content flex items-center gap-2 border-b border-base-200 pb-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Description</span>
            </h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Detailed Description</span>
              </label>
              <textarea
                placeholder="Describe the pet..."
                className={`textarea textarea-bordered rounded-xl h-36 focus:outline-primary ${errors.description ? 'textarea-error' : ''}`}
                {...register('description', { 
                  required: 'Pet description is required',
                  minLength: { value: 20, message: 'Please write a description of at least 20 characters' }
                })}
              />
              {errors.description && <span className="text-error text-xs mt-1">{errors.description.message}</span>}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-base-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-listings')}
              className="btn btn-outline rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatePetMutation.isPending}
              className="btn btn-primary rounded-xl px-8 font-bold shadow-md shadow-primary/10"
            >
              {updatePetMutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPet;
