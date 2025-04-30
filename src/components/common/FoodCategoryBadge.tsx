import { Badge } from "@/components/ui/badge"
import type { FoodCategory } from "@/lib/types"

interface FoodCategoryBadgeProps {
  category: FoodCategory
  className?: string
}

export default function FoodCategoryBadge({ category, className }: FoodCategoryBadgeProps) {
  const getCategoryDetails = (category: FoodCategory) => {
    switch (category) {
      case "prepared":
        return { label: "Prepared Food", color: "bg-blue-100 text-blue-800 hover:bg-blue-200" }
      case "grocery":
        return { label: "Grocery", color: "bg-green-100 text-green-800 hover:bg-green-200" }
      case "produce":
        return { label: "Produce", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" }
      case "bakery":
        return { label: "Bakery", color: "bg-amber-100 text-amber-800 hover:bg-amber-200" }
      case "dairy":
        return { label: "Dairy", color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" }
      case "other":
      default:
        return { label: "Other", color: "bg-gray-100 text-gray-800 hover:bg-gray-200" }
    }
  }

  const { label, color } = getCategoryDetails(category)

  return (
    <Badge className={`font-medium ${color} ${className}`} variant="outline">
      {label}
    </Badge>
  )
}
