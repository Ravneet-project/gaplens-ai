import mascotImage from '../assets/images/maskot.png';
export default function DetectiveMascot() {
  return <div className="relative w-full min-h-[270px] md:min-h-[340px] flex items-center justify-center overflow-hidden">
    <div className="mascot-halo absolute w-64 h-64 rounded-full" />
    <span className="absolute top-9 left-10 text-4xl animate-pulse">✦</span><span className="absolute top-10 right-9 text-4xl">✿</span><span className="absolute bottom-12 left-10 text-3xl">★</span>
    <div className="relative z-10 flex flex-col items-center"><img src={mascotImage} alt="GapLens original cartoon detective mascot" className="w-[200px] sm:w-[240px] lg:w-[290px] h-auto object-contain mascot-floating drop-shadow-xl"/><div className="mascot-caption mt-1 px-5 py-2.5 text-xs font-black -rotate-2">Let's find the missing clues!</div></div>
  </div>;
}
