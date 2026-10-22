import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { PlusCircle, Upload, AlertCircle, MapPin, Tag, Type } from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [type, setType] = useState('Lost');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) {
      return setError('Please upload an image of the item');
    }

    try {
      setLoading(true);

      // Construct multipart/form-data payload for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('type', type);
      formData.append('location', location);
      formData.append('image', image);

      await API.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <PlusCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report an Item</h1>
            <p className="text-sm text-gray-500">Post details about a lost or found item on campus</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center text-red-700 text-sm mb-6">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Type Toggle (Lost vs Found) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('Lost')}
                className={`py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center space-x-2 border ${
                  type === 'Lost'
                    ? 'bg-red-500 text-white border-red-500 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>Item I Lost</span>
              </button>
              <button
                type="button"
                onClick={() => setType('Found')}
                className={`py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center space-x-2 border ${
                  type === 'Found'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>Item I Found</span>
              </button>
            </div>
          </div>

          {/* Item Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Black Leather Wallet or Blue Backpack"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="IDs/Cards">IDs/Cards</option>
                <option value="Clothing">Clothing</option>
                <option value="Keys">Keys</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Main Library 2nd Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
            <textarea
              required
              rows={4}
              placeholder="Provide distinctive features, brand, color, or condition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* File Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Photo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-indigo-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="item-image-upload"
              />
              <label htmlFor="item-image-upload" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="relative h-48 w-full max-w-xs mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-lg shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center">
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Submitting Report...' : 'Publish Listing'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreatePost;