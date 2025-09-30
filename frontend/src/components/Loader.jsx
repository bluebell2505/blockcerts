// src/components/Loader.jsx
const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-medium">Processing registration...</p>
      </div>
    </div>
  );
};

export default Loader;