type AppBackgroundProps = {
  isDark: boolean;
};

export function AppBackground({ isDark }: AppBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <picture className="block h-full w-full">
        <source
          media="(max-width: 640px)"
          srcSet={isDark ? "/backgrounds/starry-mobile.png" : "/backgrounds/monet-mobile.png"}
        />
        <source
          media="(max-width: 1024px)"
          srcSet={isDark ? "/backgrounds/starry-tablet.png" : "/backgrounds/monet-tablet.png"}
        />
        <img
          src={isDark ? "/backgrounds/starry-desktop.png" : "/backgrounds/monet-desktop.png"}
          alt=""
          className={`h-full w-full object-cover ${isDark ? "brightness-[0.88] saturate-[0.92]" : "brightness-[1.02] saturate-[0.94] contrast-[0.96]"}`}
          draggable={false}
        />
      </picture>

      <div className={isDark ? "absolute inset-0 bg-[#050814]/[0.36]" : "absolute inset-0 bg-[#fff8ee]/[0.16]"} />
    </div>
  );
}
