function TitleInstructionCardSkeleton() {
  return (
    <section className="shadow-lg p-8 md:mx-8 mb-8 mx-4 rounded-2xl bg-white h-fit animate-pulse">
      <div className="leading-loose">
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <div className="h-12 w-2/3 bg-gray-200 rounded mb-4 md:mt-8 mt-4" />

          {/* Star rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>

          {/* Description */}
          <div className="w-full space-y-2 mb-8">
            <div className="h-6 w-full bg-gray-200 rounded mx-auto" />
            <div className="h-6 w-4/5 bg-gray-200 rounded mx-auto" />
          </div>
        </div>

        {/* Instructions heading */}
        <div className="h-7 w-40 bg-gray-200 rounded mt-8 mb-4 ml-4" />

        {/* Instruction steps */}
        <div className="ml-4 space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="h-5 w-5 bg-gray-200 rounded-full flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-full bg-gray-200 rounded" />
                {i % 2 === 0 && <div className="h-5 w-3/4 bg-gray-200 rounded" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TitleInstructionCardSkeleton;
