import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, registerables} from "chart.js"
import 'chartjs-adapter-date-fns'

ChartJS.register(...registerables)

export default function ExerciseGraph({ data }) {

    const chartData = {
        labels: data.x,
        datasets: [
          {
            label: data.label,
            data: data.y,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
          }
        ]
      };
    
      const options = {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'yyyy-MM-dd',
              tooltipFormat: 'MMM dd, yyyy',
              unit: 'day'
            },
          }
        }
      };
    
    return <Line options={options} data={chartData}/>
}