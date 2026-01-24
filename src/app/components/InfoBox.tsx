import { LucideIcon } from "lucide-react";

interface InfoBoxProps {
  icon?: LucideIcon;
  iconImage?: string;
  title: string;
  description: string;
  iconSize?: string;
  iconOffset?: string;
  textOffset?: string;

  // ✅ per-card overrides
  titleClassName?: string;
  descriptionClassName?: string;
}

export function InfoBox({
  icon: Icon,
  iconImage,
  title,
  description,
  iconSize = "w-8 h-8",
  iconOffset = "",
  textOffset = "",
  titleClassName = "",
  descriptionClassName = "",
}: InfoBoxProps) {
  // ✅ One place to control the "make PNG icon look #b7ff62" filter
  const GREEN_FILTER =
    "brightness(0) saturate(100%) invert(89%) sepia(31%) saturate(682%) hue-rotate(25deg) brightness(106%) contrast(107%)";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-transform duration-150 w-[65%] sm:w-full mx-auto sm:mx-0">
      {iconImage ? (
        <img
          src={iconImage}
          alt=""
          className={`${iconSize} mb-3 ${iconOffset}`}
          style={{ filter: GREEN_FILTER }}
        />
      ) : Icon ? (
        // ✅ Lucide icons: set to your green
        <Icon className={`${iconSize} text-[#b7ff62] mb-3`} />
      ) : null}

      <h3 className={`mb-2 ${textOffset} ${titleClassName}`}>{title}</h3>

      <p className={`text-sm ${textOffset} ${descriptionClassName}`}>
        {description}
      </p>
    </div>
  );
}
