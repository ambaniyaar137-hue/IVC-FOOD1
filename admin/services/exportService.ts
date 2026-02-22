
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToCSV = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
};

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string, title: string) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  
  const headers = Object.keys(data[0] || {});
  const rows = data.map(item => Object.values(item));

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 20,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillStyle: [255, 106, 0] }
  });

  doc.save(`${fileName}.pdf`);
};
