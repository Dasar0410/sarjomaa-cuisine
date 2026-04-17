function NutritionCardSkeleton() {
  return (
    <div className="card h-fit mx-4 md:mx-0 p-10 mb-8 shadow-lg rounded-xl bg-white animate-pulse">
      {/* Title */}
      <div className="h-7 w-48 bg-gray-200 rounded mb-4" />
      {/* Subtitle */}
      <div className="h-4 w-40 bg-gray-200 rounded mb-4" />

      <div className="space-y-3">
        {/* Calories row */}
        <div className="flex justify-between items-center py-2 border-b">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>

        {/* Macronutrient grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-brand-background/30 p-4 rounded-lg">
              <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
              <div className="h-6 w-14 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Total dropdown placeholder */}
        <div className="mt-6 pt-4 border-t">
          <div className="h-5 w-44 bg-gray-200 rounded" />
        </div>

        {/* Footer note */}
        <div className="mt-4 pt-4 border-t">
          <div className="h-3 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default NutritionCardSkeleton;
