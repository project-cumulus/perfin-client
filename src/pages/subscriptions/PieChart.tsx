import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ISubscription } from './ISubscription';
import "./Subscription.css";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    subscriptions: Array<ISubscription>
};

const PieChart = ({ subscriptions }: Props) => {
    const subCostByCategory = {};
    if (!subscriptions) return;
    for (const subscription of subscriptions) {
        if (!subscription.active || subscription.frequency !== "Monthly") continue;
        if (subscription.category in subCostByCategory) {
            subCostByCategory[subscription.category] += Number(subscription.amount_per_frequency);
        } else {
            subCostByCategory[subscription.category] = Number(subscription.amount_per_frequency);
        }
    };

    const costByCategory: Array<[string, number]> = Object.entries(subCostByCategory);

    const sortedCostByCategory = costByCategory.sort((a: [string, number], b: [string, number]): number => b[1] - a[1]);

    const pieChartData = sortedCostByCategory.map(el => el[1]);
    const pieChartLabels = sortedCostByCategory.map(el => el[0]);


    const data = {
        labels: pieChartLabels,
        datasets: [
            {
                label: 'Price',
                data: pieChartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div id="subscription-summary-pie-chart">
            <h3>Monthly Cost by Category</h3>
            <Pie data={data} />
        </div>
    )
}

export default PieChart;




