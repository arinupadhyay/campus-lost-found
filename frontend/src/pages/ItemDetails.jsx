import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Tag, User, ShieldCheck, AlertCircle, Send, CheckCircle2 } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proofDescription, setProofDescription] = useState('');
  const [claimStatus, setClaimStatus] = useState(null); // 'submitted' or error message
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load item details');
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) return;

    try {
      setSubmittingClaim(true);
      await API.post('/claims', {
        itemId: id,
        proofDescription
      });
      setClaimStatus('submitted');
      setSubmittingClaim(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim');
      setSubmittingClaim(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-gray-500">
        Item not found or has been removed.
      </div>
    );
  }

  const isOwner = user && user._id === item.postedBy._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Item Image */}
          <div className="relative bg-gray-100 h-72 md:h-full">
            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${
              item.type === 'Lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {item.type}
            </span>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                  <Tag size={14} className="mr-1" />
                  {item.category}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  item.status === 'Open' ? 'text-amber-700 bg-amber-50' : 'text-gray-600 bg-gray-100'
                }`}>
                  Status: {item.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{item.description}</p>

              <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4 mb-6">
                <div className="flex items-center">
                  <MapPin size={16} className="text-indigo-500 mr-2 flex-shrink-0" />
                  <span><strong>Location:</strong> {item.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="text-indigo-500 mr-2 flex-shrink-0" />
                  <span><strong>Posted:</strong> {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="text-indigo-500 mr-2 flex-shrink-0" />
                  <span><strong>Reported By:</strong> {item.postedBy.name}</span>
                </div>
              </div>
            </div>

            {/* Secure Contact Visibility */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                <ShieldCheck size={16} className="text-emerald-500 mr-1.5" />
                <span>Contact Details</span>
              </div>
              <p className="text-xs text-gray-500">
                {isOwner
                  ? `Your Email: ${item.postedBy.email}`
                  : 'Contact details are kept private until a claim is verified and approved.'}
              </p>
            </div>

          </div>
        </div>

        {/* Claim Form Section (Shown if user is logged in and is NOT the post creator) */}
        {user && !isOwner && item.status === 'Open' && (
          <div className="border-t border-gray-100 bg-indigo-50/50 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Is this your item?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Submit a claim request describing unique identifying features to prove ownership to the poster.
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm mb-4 flex items-center">
                <AlertCircle size={16} className="mr-2" />
                <span>{error}</span>
              </div>
            )}

            {claimStatus === 'submitted' ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-medium">
                  Claim request submitted successfully! You can track its status in your Dashboard.
                </span>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <textarea
                  required
                  rows={3}
                  placeholder="Describe details only the owner would know (e.g., phone lockscreen wallpaper, exact contents, receipts, distinctive scratches)..."
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition text-sm disabled:opacity-50"
                >
                  <Send size={16} />
                  <span>{submittingClaim ? 'Submitting...' : 'Submit Claim Request'}</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ItemDetails;