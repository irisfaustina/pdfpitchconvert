import * as XLSX from 'xlsx';
import { type InvestmentMemo } from './schema';

export function generateExcel(data: (InvestmentMemo & { fileName: string })[]) {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
    'File Name': item.fileName,
    'Company': item.company,
    'Description': item.description,
    'URL': item.url,
    'Industry': item.industry,
    'Traction': item.traction,
    'Round Size': item.roundSize,
  })));

  // Set column widths
  const columnWidths = [
    { wch: 30 }, // File Name
    { wch: 20 }, // Company
    { wch: 50 }, // Description
    { wch: 30 }, // URL
    { wch: 20 }, // Industry
    { wch: 40 }, // Traction
    { wch: 30 }, // Round Size
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Investment Memos');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
}
