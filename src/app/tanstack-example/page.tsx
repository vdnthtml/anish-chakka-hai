'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

export default function TanStackExamplePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['todo'],
    queryFn: fetchTodos,
  });

  if (isLoading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">An error has occurred: {error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">TanStack Query Example</h1>
      {data && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg"><strong>User ID:</strong> {data.userId}</p>
          <p className="text-lg"><strong>ID:</strong> {data.id}</p>
          <p className="text-lg"><strong>Title:</strong> {data.title}</p>
          <p className="text-lg"><strong>Completed:</strong> {data.completed ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
} 