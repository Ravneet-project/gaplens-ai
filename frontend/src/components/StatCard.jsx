
export default function StatCard({
  title,
  value,
  icon,
  color = '#7765e3',
  background = '#eee9ff',
  subtitle = ''
}) {
  return (
    <div className="group relative overflow-hidden bg-white border border-[#eeeafa] rounded-[26px] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500"
        style={{ background }}
      />

      <div className="relative z-10 flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-extrabold mt-3 text-[#20243a]">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>

        <div
          className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center"
          style={{ background }}
        >
          <i className={`bi ${icon} text-xl`} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
