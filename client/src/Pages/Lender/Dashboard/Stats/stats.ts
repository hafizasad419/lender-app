import { Briefcase, TrendingUp, Clock, PieChart } from "lucide-react"

// Mock Data
export const stats = [
    {
        title: "Active Portfolios",
        value: "12",
        change: "+2",
        icon: Briefcase
    },
    {
        title: "Total Debt Value",
        value: "$1.2M",
        change: "+$250K",
        icon: TrendingUp
    },
    {
        title: "Active Auctions",
        value: "8",
        change: "+3",
        icon: Clock,
    },
    {
        title: "Debt Recovery",
        value: "68%",
        change: "+5%",
        icon: PieChart,
    },
]
