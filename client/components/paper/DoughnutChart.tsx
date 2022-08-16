import type { NextPage } from 'next'
import {
  Chart as ChartJS,
  ChartData,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)
ChartJS.defaults.scales.linear.min = 0;

type Props = {
  doughnutPressureGraphData: ChartData<"doughnut", number[], unknown>|null,
  confirmPressure: number|null,
  title: string
}

const DoughnutChart: NextPage<Props> = (props) => {
  const {doughnutPressureGraphData, confirmPressure, title} = props;

	return (
    <div className='w-2/5 mx-auto h-full bg-gray-800 rounded-3xl'>
      <h3 className='text-center text-gray-200 font-bold my-2'>{title}</h3>
      <div className='chart-doughnut h-3/4 relative'>
        <h3 className='text-center text-gray-200 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
          {confirmPressure?(Math.round(confirmPressure*1000)/1000):"0.0"}
        </h3>
        {doughnutPressureGraphData&&
        <Doughnut
          data={doughnutPressureGraphData}
          options={
            {
              plugins: {
                legend:{
                  display:false,
                },
              },
              cutout: 40,
              maintainAspectRatio: false,
            }
          }
        />
        }
      </div>
    </div>
	);
}

export default DoughnutChart;
