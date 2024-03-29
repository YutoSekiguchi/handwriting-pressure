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
import QuestionMarkButton from '../common/QuestionMarkButton';
import { doughnutOptions } from '../../utils/DoughnutOptions';

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
  title: string,
  setShowExplainDialog: React.Dispatch<React.SetStateAction<number | null>>,
}

const DoughnutChart: NextPage<Props> = (props) => {
  const {doughnutPressureGraphData, confirmPressure, title, setShowExplainDialog} = props;

  const openDialog = () => {
    setShowExplainDialog(3);
  }

	return (
    <div className='w-2/5 h-full mx-auto bg-gray-800 rounded-3xl'>
      <div className='flex items-center justify-center'>
        <h3 className='my-2 mr-2 font-bold text-center text-gray-200'>{title}</h3>
        <div className='flex' onClick={openDialog}><QuestionMarkButton /></div>
      </div>
      <div className='relative chart-doughnut h-3/4'>
        <h3 className='absolute text-center text-gray-200 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
          {confirmPressure?(Math.round(confirmPressure*1000)/1000):"0.0"}
        </h3>
        {doughnutPressureGraphData&&
        <Doughnut
          data={doughnutPressureGraphData}
          options={
            doughnutOptions
          }
        />
        }
      </div>
    </div>
	);
}

export default DoughnutChart;
