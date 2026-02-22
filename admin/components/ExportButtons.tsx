
import React from 'react';
import { Download } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../services/exportService';

interface ExportButtonsProps {
  data: any[];
  fileName: string;
  title: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, fileName, title }) => {
  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => exportToCSV(data, fileName)}
        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2"
      >
        <Download size={14} /> CSV
      </button>
      <button 
        onClick={() => exportToExcel(data, fileName)}
        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2"
      >
        <Download size={14} /> Excel
      </button>
      <button 
        onClick={() => exportToPDF(data, fileName, title)}
        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2"
      >
        <Download size={14} /> PDF
      </button>
    </div>
  );
};

export default ExportButtons;
