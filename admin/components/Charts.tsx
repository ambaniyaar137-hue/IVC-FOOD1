
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface LineChartProps {
  data: any[];
  dataKey: string;
  color: string;
}

export const RevenueChart: React.FC<LineChartProps> = ({ data, dataKey, color }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111827', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorRev)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface DonutChartProps {
  data: any[];
}

export const DistributionChart: React.FC<DonutChartProps> = ({ data }) => {
  const COLORS = ['#FF6A00', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111827', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '16px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
