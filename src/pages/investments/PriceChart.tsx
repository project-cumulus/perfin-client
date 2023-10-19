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
    const labels = price_history.slice(0, 100)
        .reverse()
        .map(priceData => {
            return priceData.date;
        });

    const data = {
        labels,
        datasets: [
            {
                label: 'Close',
                data: price_history.slice(0, 100).reverse().map(priceData => priceData.close),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <Line options={options} data={data} />
    )
};

export default PriceChart;

