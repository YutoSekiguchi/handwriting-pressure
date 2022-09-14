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
import { Line } from 'react-chartjs-2'

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
  lineGraphData: ChartData<"line", [], unknown>|null,
  lineOptions: {},
  labels: number[],
  aboutPressureCountArray: number[]
}

const LineChart: NextPage<Props> = (props) => {

  const {lineGraphData, lineOptions, labels, aboutPressureCountArray} = props;

	return (
		<>
      {lineGraphData?
        <Line
          data={lineGraphData}
          options={lineOptions}
          id="chart-key"
        />
        :
        <Line 
          options={lineOptions}
          data={{
            labels: labels,
            datasets: [
              {
                label: '筆圧',
                data: aboutPressureCountArray,
                borderColor: "rgb(75, 192, 192)",
              },
            ],
          }}
        />
      }
    </>
	);
}

export default LineChart;