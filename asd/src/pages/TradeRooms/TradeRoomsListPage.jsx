import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tradeRoomService from '../../services/tradeRoomService';

const TradeRoomsListPage = () => {
  const [tradeRooms, setTradeRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'latest',
    searchQuery: ''
  });

  const categories = [
    'All Categories',
    'Gaming Accounts',
    'Digital Assets',
    'Game Items',
    'Software & Applications',
    'Courses & E-Learning',
    'Graphics & Design',
    'Social Media Accounts',
    'Others'
  ];

  useEffect(() => {
    const fetchTradeRooms = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would pass filters to the service
        const rooms = await tradeRoomService.listRooms(filters);
        setTradeRooms(rooms);
      } catch (error) {
        console.error('Error fetching trade rooms:', error);
        // For demo, let's populate some mock data
        const mockRooms = Array.from({ length: 12 }, (_, i) => ({
          _id: `room-${i + 1}`,
          title: [
            'Premium Fortnite Account',
            'Photoshop Templates Bundle',
            'Rare CSGO Knife Skin',
            'Professional Logo Design',
            'Social Media Marketing Course',
            'Spotify Premium Account',
            'Adobe Creative Suite License',
            'Gaming PC Setup Bundle',
            'Stock Photography Collection',
            'E-commerce Website Template',
            'Digital Marketing E-Book',
            'Music Production Samples'
          ][i % 12],
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.',
          price: Math.floor(Math.random() * 9000) + 1000,
          category: [
            'Gaming Accounts',
            'Digital Assets',
            'Game Items',
            'Graphics & Design',
            'Courses & E-Learning',
            'Software & Applications',
            'Social Media Accounts',
            'Others'
          ][Math.floor(i / 2) % 8],
          seller: {
            _id: `user-${i + 1}`,
            fullName: `Seller ${i + 1}`,
            rating: (Math.random() * 2 + 3).toFixed(1)
          },
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.3 ? 'open' : 'sold',
          images: []
        }));
        
        setTradeRooms(mockRooms);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeRooms();
  }, [filters.category, filters.sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, we would trigger a new fetch with the search query
    console.log('Searching for:', filters.searchQuery);
  };

  const filteredRooms = tradeRooms
    .filter(room => 
      (filters.category === '' || filters.category === 'All Categories' || room.category === filters.category) &&
      (filters.minPrice === '' || room.price >= parseInt(filters.minPrice)) &&
      (filters.maxPrice === '' || room.price <= parseInt(filters.maxPrice)) &&
      (filters.searchQuery === '' || 
        room.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        room.description.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch(filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'latest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade Rooms</h1>
          <p className="mt-1 text-gray-600">Browse and find digital items to purchase</p>
        </div>
        <Link 
          to="/create-trade-room" 
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Trade Room
        </Link>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-grow">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search for trade rooms..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (coins)
                </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Min"
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (coins)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Max"
                />
              </div>
              
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Link 
                key={room._id} 
                to={`/trade-rooms/${room._id}`}
                className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <div className="text-gray-400">[Item Preview]</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-indigo-600 font-semibold">{room.category}</div>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        room.status === 'sold' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {room.status === 'sold' ? 'Sold' : 'Available'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">{room.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xl">{room.price.toLocaleString()} coins</div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 border-t pt-4 border-gray-100">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                        {room.seller.fullName.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">{room.seller.fullName}</p>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-gray-600 ml-1">{room.seller.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-10 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No trade rooms found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters to find what you're looking for</p>
            <button
              onClick={() => setFilters({
                category: '',
                minPrice: '',
                maxPrice: '',
                sortBy: 'latest',
                searchQuery: ''
              })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeRoomsListPage;