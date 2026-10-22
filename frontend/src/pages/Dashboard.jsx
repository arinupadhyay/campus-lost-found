import { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Tag, Clock, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'claims'

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, claimsRes] = await Promise.all([
        API.get('/items'),
        API.get('/claims/myclaims')
      ]);

      // Filter global items down to items posted by this logged-in student
      const userItems = itemsRes.data.filter((item) => item.postedBy._id === user._id);
      setMyItems(userItems);
      setMyClaims(claimsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await API.delete(`/items/${itemId}`);
      setMyItems(myItems.filter((item) => item._id !== itemId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-6 font-semibold text-sm transition border-b-2 ${
            activeTab === 'items'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Reported Items ({myItems.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`py-3 px-6 font-semibold text-sm transition border-b-2 ${
            activeTab === 'claims'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Claims Tracked ({myClaims.length})
        </button>
      </div>

      {/* Tab 1: My Reported Items */}
      {activeTab === 'items' && (
        <div>
          {myItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                        item.type === 'Lost' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {item.type}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Delete listing"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-xs mb-3">{item.location}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-400">Status: <strong>{item.status}</strong></span>
                    <span className="text-indigo-600 font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
              You haven't reported any items yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Claims Tracked */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length > 0 ? (
            myClaims.map((claim) => (
              <div key={claim._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{claim.item?.title || 'Item Deleted'}</h3>
                  <p className="text-xs text-gray-500 mb-2">Proof Details: "{claim.proofDescription}"</p>
                  <span className="text-xs text-gray-400">Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                    claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    claim.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {claim.status === 'Approved' && <CheckCircle size={14} />}
                    {claim.status === 'Rejected' && <XCircle size={14} />}
                    {claim.status === 'Pending' && <Clock size={14} />}
                    <span>{claim.status}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
              You haven't submitted any item claim requests yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;