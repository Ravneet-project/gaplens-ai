
import mascotImage from '../assets/images/maskot.png';

export default function DetectiveMascot() {
  return (
    <div className="relative w-full min-h-[270px] md:min-h-[340px] flex items-center justify-center overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute w-60 h-60 rounded-full bg-white/30 blur-sm"></div>
      <div className="absolute w-44 h-44 rounded-full bg-purple-300/20 blur-2xl"></div>

      {/* Floating stars */}
      <i className="bi bi-stars absolute top-10 left-10 text-[#7765e3] text-2xl animate-pulse"></i>

      <i className="bi bi-star-fill absolute top-12 right-12 text-[#ffd779] text-2xl"></i>

      <i className="bi bi-circle-fill absolute bottom-16 left-14 text-[#b8aaff] text-xs"></i>

      {/* Main cartoon mascot */}
      <div className="relative z-10 flex flex-col items-center">

        <img
          src={mascotImage}
          alt="GapLens AI cartoon mascot"
          className="
            w-[190px]
            sm:w-[230px]
            md:w-[270px]
            lg:w-[290px]
            h-auto
            object-contain
            drop-shadow-2xl
            animate-[mascotFloat_3.5s_ease-in-out_infinite]
          "
        />

        {/* Mascot caption */}
        <div className="mt-2 bg-white/90 px-5 py-2.5 rounded-full shadow-md text-xs font-bold text-[#7765e3] text-center">
          ✨ Let's find the missing pieces!
        </div>

      </div>
    </div>
  );
}
