import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ISecurity } from '../../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type Props = {
    selectedSecurity: ISecurity
}

const PriceChart = ({ selectedSecurity }: Props) => {
    const { price_history, name } = selectedSecurity;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Price Chart ${name}`,
            },
        },
    };
    const labels = price_history.slice(-252)
        .map(priceData => {
            return priceData.date;
        });

    const priceData = price_history.slice(-252).map(priceData => priceData.close);
    let color = 'rgb(90,90,90)';
    if (Number(priceData[0]) < Number(priceData[priceData.length - 1])) {
        color = 'rgb(50, 200, 90)' // green
    } else {
        color = 'rgb(255, 60, 50)' // red
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Close',
                data: priceData,
                borderColor: color,
                backgroundColor: color,
            },
        ],
    };

    return (
        <Line options={options} data={data} />
    )
};

export default PriceChart;

