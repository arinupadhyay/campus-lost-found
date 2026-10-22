import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';

const ItemCard = ({ item }) => {
  // Format the date nicely
  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col justify-between border border-gray-100">
      <div>
        {/* Item Image */}
        <div className="relative h-48 w-full bg-gray-200">
          <img 
            src={`http://localhost:5000${item.imageUrl}`} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          {/* Lost or Found Badge */}
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase ${
            item.type === 'Lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {item.type}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              <Tag size={14} className="mr-1" />
              {item.category}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              item.status === 'Open' ? 'text-amber-700 bg-amber-50' : 'text-gray-600 bg-gray-100'
            }`}>
              {item.status}
            </span>
          </div>

          <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{item.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>

          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin size={14} className="mr-1.5 text-gray-400" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1.5 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Link */}
      <div className="px-5 pb-5 pt-0">
        <Link 
          to={`/items/${item._id}`}
          className="block w-full text-center bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-medium py-2 rounded-lg transition text-sm border border-gray-200"
        >
          View Details & Claim
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;