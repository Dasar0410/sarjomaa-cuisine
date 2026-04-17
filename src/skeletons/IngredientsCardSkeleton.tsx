function IngredientsCardSkeleton() {
  return (
    <div className="card h-fit p-10 mb-8 shadow-lg rounded-xl mx-4 md:mx-0 bg-white animate-pulse">
      {/* Header */}
      <div className="mb-6 pb-4 border-b">
        {/* Title */}
        <div className="h-7 w-36 bg-gray-200 rounded mb-3" />

        {/* Portions control */}
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="h-6 w-8 bg-gray-200 rounded" />
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Ingredient list */}
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0" />
            <div className="h-5 bg-gray-200 rounded" style={{ width: `${55 + (i * 7) % 30}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default IngredientsCardSkeleton;
