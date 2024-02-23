import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#6875F5', '#FF8042'];


const ReportPieChart = ({data}) => (
  <div className="chart-container">


  
  <PieChart width={400} height={400} className='mx-auto'>
    <Pie
      data={data}
      cx={200}
      cy={200}
      innerRadius={60}
      outerRadius={80}
      fill="#8884d8"
      paddingAngle={0}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
  </div>
);

export default ReportPieChart;
