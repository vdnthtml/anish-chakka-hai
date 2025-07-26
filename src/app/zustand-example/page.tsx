import { useCounterStore } from '../../store';

export default function ZustandExamplePage() {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Zustand Counter Example</h1>
      <p className="text-2xl mb-6">Count: {count}</p>
      <div className="space-x-4">
        <button
          onClick={increment}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
        >
          Decrement
        </button>
      </div>
    </div>
  );
} 