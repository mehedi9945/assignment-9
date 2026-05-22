import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { 
  ClipboardList, Heart, Sparkles, CheckCircle2, AlertCircle, 
  Trash2, Edit, Eye, MessageSquare, X, Calendar, User, Mail, MessageCircle
} from 'lucide-react';

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  // Modal State
  const [selectedPet, setSelectedPet] = useState(null); // holds pet object when modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Owner Listings
  const { data: myListings = [], isLoading: isListingsLoading } = useQuery({
    queryKey: ['myListings', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/my-listings');
      return res.data;
    },
    enabled: !!user?.email,
  });

  // 2. Fetch Aggregated Statistics
  const { data: stats = { totalListings: 0, availablePets: 0, adoptedPets: 0 }, isLoading: isStatsLoading } = useQuery({
    queryKey: ['listingStats', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/my-listings/stats');
      return res.data;
    },
    enabled: !!user?.email,
  });

  // 3. Fetch Requests for the selected pet (conditional query)
  const { data: petRequests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ['petRequests', selectedPet?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/requests/pet/${selectedPet?._id}`);
      return res.data;
    },
    enabled: !!selectedPet?._id,
  });

  // 4. Delete Pet Mutation
  const deleteMutation = useMutation({
    mutationFn: async (petId) => {
      const res = await axiosSecure.delete(`/api/pets/${petId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Pet listing deleted successfully');
      queryClient.invalidateQueries(['myListings']);
      queryClient.invalidateQueries(['listingStats']);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to delete listing.');
    }
  });

  // 5. Update Request Status Mutation (Approve/Reject)
  const requestStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }) => {
      const res = await axiosSecure.put(`/api/requests/${requestId}`, { status });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Request status updated');
      queryClient.invalidateQueries(['myListings']);
      queryClient.invalidateQueries(['listingStats']);
      // Refresh requests list for the current modal
      queryClient.invalidateQueries(['petRequests', selectedPet?._id]);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update request status.');
    }
  });

  // Handle Delete Button Click
  const handleDelete = (petId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete this pet profile permanently. All associated adoption requests will be deleted as well.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-primary, #641ae6)',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: 'var(--bg, #ffffff)',
      color: 'var(--text-h, #000000)',
      customClass: {
        popup: 'rounded-3xl border border-base-200 shadow-2xl',
        confirmButton: 'btn btn-primary rounded-xl',
        cancelButton: 'btn btn-error rounded-xl ml-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(petId);
      }
    });
  };

  const handleOpenRequestsModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleCloseRequestsModal = () => {
    setSelectedPet(null);
    setIsModalOpen(false);
  };

  const handleApproveRequest = (requestId) => {
    Swal.fire({
      title: 'Approve Adoption?',
      text: "Approving this request will mark the pet as adopted and reject all other pending requests. This cannot be undone.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel',
      background: 'var(--bg, #ffffff)',
      color: 'var(--text-h, #000000)',
      customClass: {
        popup: 'rounded-3xl border border-base-200 shadow-2xl',
        confirmButton: 'btn btn-success text-white rounded-xl',
        cancelButton: 'btn btn-error rounded-xl ml-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        requestStatusMutation.mutate({ requestId, status: 'approved' });
      }
    });
  };

  const handleRejectRequest = (requestId) => {
    Swal.fire({
      title: 'Reject Request?',
      text: "Are you sure you want to reject this adoption request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      background: 'var(--bg, #ffffff)',
      color: 'var(--text-h, #000000)',
      customClass: {
        popup: 'rounded-3xl border border-base-200 shadow-2xl',
        confirmButton: 'btn btn-error rounded-xl',
        cancelButton: 'btn btn-neutral rounded-xl ml-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        requestStatusMutation.mutate({ requestId, status: 'rejected' });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            My Pet Listings
          </h1>
          <p className="text-sm text-base-content/60">Manage your pet adoption listings and view applicant details</p>
        </div>
        <Link to="/dashboard/add-pet" className="btn btn-primary btn-sm sm:btn-md rounded-xl">
          Add New Pet
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-base-content/50 uppercase">Total Listings</span>
            <h3 className="text-3xl font-extrabold text-base-content">{isStatsLoading ? '...' : stats.totalListings}</h3>
          </div>
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-base-content/50 uppercase">Available Companions</span>
            <h3 className="text-3xl font-extrabold text-success">{isStatsLoading ? '...' : stats.availablePets}</h3>
          </div>
          <div className="p-3.5 bg-success/10 text-success rounded-2xl">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-base-content/50 uppercase">Adopted Pets</span>
            <h3 className="text-3xl font-extrabold text-info">{isStatsLoading ? '...' : stats.adoptedPets}</h3>
          </div>
          <div className="p-3.5 bg-info/10 text-info rounded-2xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Listings Section */}
      {isListingsLoading ? (
        <div className="flex flex-col gap-4 w-full">
          <div className="skeleton h-12 w-full rounded-xl"></div>
          <div className="skeleton h-12 w-full rounded-xl"></div>
          <div className="skeleton h-12 w-full rounded-xl"></div>
        </div>
      ) : myListings.length === 0 ? (
        <div className="card bg-base-100 border border-base-300 p-12 text-center rounded-3xl space-y-4">
          <AlertCircle className="h-12 w-12 text-base-content/30 mx-auto" />
          <h3 className="text-xl font-bold text-base-content">No Listings Yet</h3>
          <p className="text-sm text-base-content/65 max-w-sm mx-auto">
            You haven't listed any pets for adoption. Let's add your first pet companion!
          </p>
          <Link to="/dashboard/add-pet" className="btn btn-primary rounded-xl px-6">
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-300 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-base-200 text-base-content font-bold border-b border-base-300">
                  <th className="py-4 pl-6">Pet Image</th>
                  <th>Name</th>
                  <th>Adoption Fee</th>
                  <th>Status</th>
                  <th className="pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {myListings.map((pet) => (
                  <tr key={pet._id} className="hover:bg-base-200/40">
                    <td className="py-4 pl-6">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={pet.imageUrl} alt={pet.name} className="object-cover" />
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-base-content">{pet.name}</td>
                    <td className="font-semibold text-primary">${pet.adoptionFee}</td>
                    <td>
                      <span className={`badge ${pet.status === 'adopted' ? 'badge-success text-white' : 'badge-primary'} font-semibold rounded-md`}>
                        {pet.status === 'adopted' ? 'Adopted' : 'Available'}
                      </span>
                    </td>
                    <td className="pr-6 text-right space-x-1.5 md:space-x-2">
                      <Link 
                        to={`/pet/${pet._id}`} 
                        className="btn btn-ghost btn-circle btn-sm text-base-content/75 hover:bg-base-200"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link 
                        to={`/dashboard/edit-pet/${pet._id}`} 
                        className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10"
                        title="Edit companion details"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(pet._id)}
                        className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                        title="Delete listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenRequestsModal(pet)}
                        className="btn btn-outline btn-sm rounded-xl gap-1 text-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Requests
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. REQUESTS MODAL */}
      {isModalOpen && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={handleCloseRequestsModal}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-base-100 border border-base-300 rounded-3xl w-full max-w-4xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
              <div>
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                  <Heart className="text-primary h-5 w-5" />
                  Adoption Applications: <span className="text-primary">{selectedPet.name}</span>
                </h3>
                <p className="text-xs text-base-content/65">Review applicants seeking to adopt this companion</p>
              </div>
              <button 
                onClick={handleCloseRequestsModal}
                className="btn btn-ghost btn-circle btn-sm text-base-content/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {isRequestsLoading ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="skeleton h-10 w-full"></div>
                  <div className="skeleton h-10 w-full"></div>
                </div>
              ) : petRequests.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <MessageCircle className="h-10 w-10 text-base-content/30 mx-auto" />
                  <h4 className="font-bold text-base-content">No Applications Received</h4>
                  <p className="text-xs text-base-content/60 max-w-xs mx-auto">
                    Nobody has submitted an adoption request for {selectedPet.name} yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {petRequests.map((request) => (
                    <div 
                      key={request._id}
                      className="border border-base-200 rounded-2xl p-5 bg-base-200/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Applicant details */}
                      <div className="space-y-3 flex-grow max-w-xl">
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-base-content">
                            <User className="h-4 w-4 text-primary shrink-0" />
                            <span>{request.userName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/65">
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{request.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/65">
                            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>Proposed Date: <span className="font-medium text-base-content">{request.pickupDate}</span></span>
                          </div>
                        </div>
                        {request.message && (
                          <div className="bg-base-100 p-3 rounded-xl border border-base-200 text-sm text-base-content/75 relative">
                            <span className="text-[10px] font-bold text-primary block mb-1 uppercase tracking-wider">Applicant Note:</span>
                            "{request.message}"
                          </div>
                        )}
                      </div>

                      {/* Right: Actions or Status */}
                      <div className="shrink-0 flex items-center gap-3">
                        {request.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              disabled={requestStatusMutation.isPending}
                              className="btn btn-outline btn-error btn-sm rounded-xl px-4"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproveRequest(request._id)}
                              disabled={requestStatusMutation.isPending}
                              className="btn btn-success text-white btn-sm rounded-xl px-4"
                            >
                              Approve
                            </button>
                          </>
                        ) : (
                          <span className={`badge ${request.status === 'approved' ? 'badge-success text-white' : 'badge-error text-white'} font-semibold px-4 py-2.5 rounded-lg text-xs`}>
                            {request.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-base-200 flex justify-end bg-base-200/30">
              <button onClick={handleCloseRequestsModal} className="btn btn-neutral btn-sm rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
