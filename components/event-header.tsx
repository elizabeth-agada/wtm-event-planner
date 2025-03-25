import { CalendarIcon, MapPinIcon } from "lucide-react"

interface EventHeaderProps {
  title: string
  subtitle: string
  date: string
  location: string
}

export default function EventHeader({ title, subtitle, date, location }: EventHeaderProps) {
  return (
    <div className="bg-[#2480F0] text-white py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-xl mt-2">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

