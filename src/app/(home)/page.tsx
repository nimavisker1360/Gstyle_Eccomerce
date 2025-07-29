export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ecomstarter</h1>
      <p className="text-lg">This is a simple test page to verify the app is working.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold">Sample Product 1</h2>
          <p className="text-gray-600">$19.99</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold">Sample Product 2</h2>
          <p className="text-gray-600">$29.99</p>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold">Sample Product 3</h2>
          <p className="text-gray-600">$39.99</p>
        </div>
      </div>
    </div>
  );
}