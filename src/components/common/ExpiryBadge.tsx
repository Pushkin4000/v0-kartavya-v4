import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface ExpiryBadgeProps {
  expiryDate: Date
  className?: string
}

export default function ExpiryBadge({ expiryDate, className }: ExpiryBadgeProps) {
  const now = new Date()
  const isExpired = expiryDate < now
  const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: true })

  // Determine color based on expiry time
  const getColor = () => {
    if (isExpired) {
      return "bg-red-100 text-red-800 hover:bg-red-200"
    }

    const hoursLeft = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursLeft < 12) {
      return "bg-red-100 text-red-800 hover:bg-red-200"
    } else if (hoursLeft < 24) {
      return "bg-amber-100 text-amber-800 hover:bg-amber-200"
    } else {
      return "bg-green-100 text-green-800 hover:bg-green-200"
    }
  }

  return (
    <Badge className={`font-medium ${getColor()} ${className}`} variant="outline">
      {isExpired ? "Expired" : `Expires ${timeLeft}`}
    </Badge>
  )
}
