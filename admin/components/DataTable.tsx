
import React from 'react';

interface DataTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ headers, data, renderRow }) => {
  return (
    <div className="bg-[#111827] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              {headers.map((header, i) => (
                <th key={i} className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length > 0 ? (
              data.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-8 py-20 text-center">
                  <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">No data available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
