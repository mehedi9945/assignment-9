import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { 
  HeartHandshake, Eye, AlertCircle, Trash2, Calendar, DollarSign, ExternalLink
} from 'lucide-react';

const MyRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch adoption requests submitted by this user
  const { data: myRequests = [], isLoading } = useQuery({
    queryKey: ['myRequests', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/my-requests');
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Cancel request mutation
  const cancelMutation = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosSecure.delete(`/api/requests/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Adoption request cancelled successfully');
      queryClient.invalidateQueries(['myRequests']);
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to cancel request.');
    }
  });

  // Handle Cancel Click
  const handleCancelClick = (requestId, petName) => {
    Swal.fire({
      title: 'Cancel Request?',
      text: `Are you sure you want to cancel your adoption request for ${petName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      background: 'var(--bg, #ffffff)',
      color: 'var(--text-h, #000000)',
      customClass: {
        popup: 'rounded-3xl border border-base-200 shadow-2xl',
        confirmButton: 'btn btn-error rounded-xl',
        cancelButton: 'btn btn-neutral rounded-xl ml-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(requestId);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-base-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-primary" />
            My Adoption Requests
          </h1>
          <p className="text-sm text-base-content/60">Track the status of your pet adoption applications</p>
        </div>
      </div>

      {/* Requests Content */}
      {isLoading ? (
        <div className="flex flex-col gap-4 w-full">
          <div className="skeleton h-12 w-full rounded-xl"></div>
          <div className="skeleton h-12 w-full rounded-xl"></div>
        </div>
      ) : myRequests.length === 0 ? (
        <div className="card bg-base-100 border border-base-300 p-12 text-center rounded-3xl space-y-4">
          <AlertCircle className="h-12 w-12 text-base-content/30 mx-auto" />
          <h3 className="text-xl font-bold text-base-content">No Requests Found</h3>
          <p className="text-sm text-base-content/65 max-w-sm mx-auto">
            You haven't submitted any adoption requests yet. Find a pet and start the journey!
          </p>
          <Link to="/all-pets" className="btn btn-primary rounded-xl px-6">
            Browse Adoptable Pets
          </Link>
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-300 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-base-200 text-base-content font-bold border-b border-base-300">
                  <th className="py-4 pl-6">Pet Name</th>
                  <th>Request Date</th>
                  <th>Proposed Pickup</th>
                  <th>Adoption Fee</th>
                  <th>Status</th>
                  <th className="pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {myRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-base-200/40">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img src={request.petImage} alt={request.petName} className="object-cover" />
                          </div>
                        </div>
                        <span className="font-bold text-base-content">{request.petName}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/75">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-sm font-medium text-base-content/85">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        {request.pickupDate}
                      </span>
                    </td>
                    <td className="font-semibold text-primary">
                      <span className="flex items-center">
                        <DollarSign className="h-3.5 w-3.5 shrink-0" />
                        {request.adoptionFee}
                      </span>
                    </td>
                    <td>
                      <span className={`badge font-semibold rounded-md ${
                        request.status === 'approved' 
                          ? 'badge-success text-white' 
                          : request.status === 'rejected' 
                          ? 'badge-error text-white' 
                          : 'badge-warning text-warning-content'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="pr-6 text-right space-x-2">
                      <Link 
                        to={`/pet/${request.petId}`} 
                        className="btn btn-ghost btn-circle btn-sm text-primary hover:bg-primary/10"
                        title="View pet profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {request.status === 'pending' ? (
                        <button
                          onClick={() => handleCancelClick(request._id, request.petName)}
                          className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                          title="Cancel application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="btn btn-ghost btn-circle btn-sm text-base-content/20 cursor-not-allowed"
                          title="Cannot cancel completed requests"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
