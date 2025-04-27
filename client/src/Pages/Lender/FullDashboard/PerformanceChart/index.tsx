import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PerformanceChartProps {
  timeframe: "week" | "month" | "quarter" | "year"
}

const PerformanceChart = ({ timeframe }: PerformanceChartProps) => {
  // Generate mock data based on timeframe
  const generateChartData = (): ChartData<"line"> => {
    let labels: string[] = []
    let recoveryData: number[] = []
    let auctionData: number[] = []

    switch (timeframe) {
      case "week":
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        recoveryData = [65, 59, 80, 81, 56, 55, 70]
        auctionData = [28, 48, 40, 19, 86, 27, 90]
        break
      case "month":
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
        recoveryData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100))
        auctionData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100))
        break
      case "quarter":
        labels = ["Jan", "Feb", "Mar"]
        recoveryData = [75, 82, 90]
        auctionData = [45, 62, 80]
        break
      case "year":
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        recoveryData = [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90]
        auctionData = [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56]
        break
    }

    return {
      labels,
      datasets: [
        {
          label: "Recovery Rate",
          data: recoveryData,
          borderColor: "#246F78",
          backgroundColor: "rgba(36, 111, 120, 0.1)",
          tension: 0.4,
        },
        {
          label: "Auction Success",
          data: auctionData,
          borderColor: "#F55800",
          backgroundColor: "rgba(245, 88, 0, 0.1)",
          tension: 0.4,
        },
      ],
    }
  }

  const chartData = generateChartData()

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default PerformanceChart

