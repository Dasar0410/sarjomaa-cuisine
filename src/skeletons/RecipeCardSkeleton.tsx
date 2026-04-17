function RecipeCardSkeleton() {
  return (
    <div className="bg-white w-full rounded-2xl overflow-hidden shadow-md border border-brand-border/30 flex flex-col animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gray-300 flex-shrink-0" />

      <div className="px-3 py-3 md:px-6 md:py-5 flex flex-col flex-grow">
        {/* Star rating */}
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>

        {/* Title */}
        <div className="mb-2 md:mb-3">
          <div className="h-6 md:h-8 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Tags (hidden on mobile, same as real component) */}
        <div className="hidden md:flex flex-wrap gap-1.5 mb-3">
          <div className="h-6 w-16 bg-gray-200 rounded-md" />
          <div className="h-6 w-20 bg-gray-200 rounded-md" />
          <div className="h-6 w-14 bg-gray-200 rounded-md" />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border/20 mt-auto">
          <div className="flex items-center gap-2">
            <div className="h-7 w-16 md:w-20 bg-gray-200 rounded-full" />
            <div className="h-7 w-14 md:w-18 bg-gray-200 rounded-full" />
            <div className="h-7 w-18 md:w-22 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCardSkeleton;
