export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1117]">
      <div className="flex flex-col items-center gap-8">

        {/* Animated Pulse Rings */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          
          <span className="absolute w-full h-full rounded-full bg-blue-500/20 animate-ping"></span>
          <span className="absolute w-14 h-14 rounded-full bg-blue-500/30 animate-pulse"></span>
          <span className="w-8 h-8 rounded-full bg-blue-500 animate-bounce"></span>

        </div>

        {/* Text Animation */}
        <div className="text-center space-y-1">
          <h1 className="text-white text-xl font-semibold tracking-wide animate-pulse">
            Loading
          </h1>
          <p className="text-gray-400 text-sm">
            Preparing your experience...
          </p>
        </div>

        {/* Moving dots */}
        <div className="flex gap-2 mt-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
        </div>

      </div>
    </div>
  );
}