
interface InfoBoxProps {
  title: string
  subtitle: string
  bgColor: string
  textColor: string
  subtextColor: string
  borderColor: string
}

export function InfoBox({
  title,
  subtitle,
  bgColor,
  textColor,
  subtextColor,
  borderColor,
}: InfoBoxProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border-2 ${borderColor}`}>
      <h3 className={`${textColor} font-bold text-lg`}>{title}</h3>
      <p className={`${subtextColor} text-sm mt-2`}>{subtitle}</p>
    </div>
  )
}
