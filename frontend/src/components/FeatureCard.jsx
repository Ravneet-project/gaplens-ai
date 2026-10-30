
export default function FeatureCard({
  title,
  description,
  icon,
  background,
  iconColor,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left bg-white border border-[#eeeafa] rounded-[28px] p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div
        className="w-14 h-14 rounded-[20px] flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform"
        style={{ background }}
      >
        <i className={`bi ${icon} text-2xl`} style={{ color: iconColor }} />
      </div>

      <h3 className="font-extrabold text-lg text-[#20243a] mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        {description}
      </p>

      <span className="inline-flex items-center gap-2 text-[#7765e3] font-bold text-sm">
        Explore feature
        <i className="bi bi-arrow-up-right group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </span>
    </button>
  );
}
