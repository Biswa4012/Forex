import React, { useState, useEffect, useRef } from 'react';

// Main App component
const App = () => {
  // State for the mouse follower position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // State to manage the list of forex pairs and their data
  const [forexPairs, setForexPairs] = useState([
    { name: 'EUR/USD', price: 1.0750, change: 0.0015, up: true },
    { name: 'XAU/USD', price: 2315.65, change: -5.20, up: false },
    { name: 'GBP/JPY', price: 198.45, change: 0.10, up: true },
    { name: 'USD/CAD', price: 1.3705, change: -0.0008, up: false },
    { name: 'AUD/USD', price: 0.6655, change: 0.0003, up: true },
    { name: 'USD/CHF', price: 0.8950, change: -0.0005, up: false },
    { name: 'NZD/USD', price: 0.6150, change: 0.0001, up: true },
    { name: 'EUR/JPY', price: 178.60, change: -0.15, up: false },
    { name: 'CAD/JPY', price: 106.75, change: 0.05, up: true },
    { name: 'CHF/JPY', price: 167.30, change: -0.08, up: false },
  ]);
  // State to manage the alert modal visibility and the selected pair for the modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState(null);
  
  // Use a ref to store the request ID for the animation loop
  const requestRef = useRef();

  // Handle mouse movement for the gradient follower
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  // Simulate live price changes with a mock API update
  useEffect(() => {
    const updatePrices = () => {
      setForexPairs(currentPairs => 
        currentPairs.map(pair => {
          // Simulate small random fluctuations
          const fluctuation = (Math.random() - 0.5) * 0.001 * pair.price;
          const newPrice = pair.price + fluctuation;
          const change = Math.abs(fluctuation).toFixed(4); // Use absolute value for change display
          return {
            ...pair,
            price: parseFloat(newPrice.toFixed(4)),
            change: parseFloat(change),
            up: fluctuation >= 0
          };
        })
      );
    };

    const interval = setInterval(updatePrices, 3000); // Update every 3 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Effect for mouse follower
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Function to open the alert modal with the selected pair
  const openAlertModal = (pair) => {
    setSelectedPair(pair);
    setIsAlertModalOpen(true);
  };
  
  // Function to close the alert modal
  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedPair(null);
  };

  return (
    <div className="min-h-screen relative font-sans text-gray-100 overflow-hidden bg-[#010915] before:absolute before:inset-0 before:z-0 before:bg-gradient-to-br before:from-[#120042] before:to-[#010915] before:animate-bg-flow">
      {/* Background circles for aesthetic effect */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[30%] right-[5%] w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[20%] left-[20%] w-56 h-56 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Mouse following gradient circle */}
      <div
        className="fixed z-50 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 blur-xl opacity-70 pointer-events-none animate-pulse-slow"
        style={{
          transform: `translate(${mousePosition.x - 48}px, ${mousePosition.y - 48}px)`,
          transition: 'transform 0.1s linear'
        }}
      ></div>

      {/* Main content container */}
      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400">
            Quantum Markets
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Real-time forex and precious metals data.
          </p>
        </header>

        {/* Forex pairs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {forexPairs.map((pair, index) => (
            <TradingCard
              key={pair.name}
              pair={pair}
              onAddAlert={openAlertModal}
            />
          ))}
        </div>
      </div>
      
      {/* Alert Modal */}
      {isAlertModalOpen && (
        <AlertModal
          pair={selectedPair}
          onClose={closeAlertModal}
        />
      )}

      {/* Custom Styles for animations and fonts */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        .font-sans {
          font-family: 'Montserrat', sans-serif;
        }

        @keyframes bg-flow {
          0% { transform: scale(1.1) translate(0%, 0%); }
          50% { transform: scale(1.5) translate(10%, 10%); }
          100% { transform: scale(1.1) translate(0%, 0%); }
        }
        .animate-bg-flow::before {
          animation: bg-flow 30s ease-in-out infinite alternate;
        }

        @keyframes blob {
          0% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(30px, -50px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-blob {
          animation: blob 10s linear infinite alternate;
        }

        @keyframes pulse-slow {
            0%, 100% { opacity: 0.7; transform: scale(1.0) }
            50% { opacity: 0.85; transform: scale(1.1) }
        }
        .animate-pulse-slow {
            animation: pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Hide the native number input arrows */
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { 
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield; /* Firefox */
        }
        `}
      </style>
    </div>
  );
};

// Reusable Trading Card Component
const TradingCard = ({ pair, onAddAlert }) => {
  const { name, price, change, up } = pair;
  const changeColor = up ? 'text-green-400' : 'text-red-400';
  const arrowIcon = up ? '▲' : '▼'; // Unicode arrow icons

  // State for the alert button hover to show the slide-out box
  const [isHoveringBell, setIsHoveringBell] = useState(false);

  return (
    <div className="relative group w-full p-6 rounded-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-lg transform transition-all duration-300 hover:scale-[1.03]">
      {/* Small trend indicator */}
      <div className={`absolute top-4 right-4 ${changeColor} font-bold text-lg`}>
        {arrowIcon}
      </div>

      {/* Main card content */}
      <div className="flex flex-col items-start">
        <h2 className="text-xl font-bold mb-2">
          {name}
        </h2>
        <div className="flex items-baseline space-x-2">
          <p className="text-3xl font-light">{price.toFixed(4)}</p>
          <p className={`text-lg font-medium ${changeColor}`}>
            ({change.toFixed(4)})
          </p>
        </div>
      </div>

      {/* Add Alert Button section */}
      <div className="mt-6 flex items-center justify-end">
        <div className="relative">
          {/* Slide-out info box on hover */}
          {isHoveringBell && (
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-sm whitespace-nowrap opacity-100 transition-opacity duration-300">
              Add Alert
            </div>
          )}
          
          <button
            onClick={() => onAddAlert(pair)}
            onMouseEnter={() => setIsHoveringBell(true)}
            onMouseLeave={() => setIsHoveringBell(false)}
            className="p-3 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm transition-all duration-300 hover:bg-opacity-30 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Alert Modal Component
const AlertModal = ({ pair, onClose }) => {
  const [alertPrice, setAlertPrice] = useState(pair.price);
  const [direction, setDirection] = useState('above');
  const modalRef = useRef(null);
  
  // Close the modal when clicking outside
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCreateAlert = () => {
    // Here you would typically send data to a backend or handle it locally
    console.log(`Alert created for ${pair.name}: Price goes ${direction} ${alertPrice}`);
    onClose(); // Close modal after action
  };

  const handlePriceChange = (increment) => {
    setAlertPrice(prevPrice => parseFloat((prevPrice + increment).toFixed(4)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm"></div>
      <div 
        ref={modalRef}
        className="relative p-8 rounded-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 shadow-xl w-full max-w-sm transform scale-100 transition-all duration-300"
      >
        <h3 className="text-xl font-bold text-gray-200 mb-4">Set Alert for {pair.name}</h3>
        <p className="text-gray-400 text-sm mb-4">Current Price: <span className="text-lg font-semibold text-white">{pair.price.toFixed(4)}</span></p>

        <div className="space-y-4">
          <div>
            <label htmlFor="alert-price" className="block text-sm font-medium text-gray-300">
              Price
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                id="alert-price"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                step="0.01"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 bg-opacity-40 border border-transparent text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-1">
                {/* Up button */}
                <button 
                  onClick={() => handlePriceChange(0.0001)}
                  className="w-5 h-5 flex items-center justify-center text-white bg-transparent rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5l-7 7 14 0z"/></svg>
                </button>
                {/* Down button */}
                <button
                  onClick={() => handlePriceChange(-0.0001)}
                  className="w-5 h-5 flex items-center justify-center text-white bg-transparent rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l-7-7 14 0z"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="alert-direction" className="text-sm font-medium text-gray-300">
              Trigger when price goes:
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="above"
                  checked={direction === 'above'}
                  onChange={() => setDirection('above')}
                  className="form-radio text-teal-500 border-gray-600 focus:ring-teal-500"
                />
                <span className="text-gray-200">Above</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="direction"
                  value="below"
                  checked={direction === 'below'}
                  onChange={() => setDirection('below')}
                  className="form-radio text-teal-500 border-gray-600 focus:ring-teal-500"
                />
                <span className="text-gray-200">Below</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 bg-opacity-40 hover:bg-opacity-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAlert}
            className="w-1/2 py-2 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 transition-all duration-300"
          >
            Create Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

