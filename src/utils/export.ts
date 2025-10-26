import * as XLSX from 'xlsx';
import { SessionRecord } from '@/types';
import { formatDateTime } from './time';

export const exportSessionsToExcel = (sessions: SessionRecord[], fileName = 'pixel-bar-report.xlsx') => {
  const data = sessions.map((session) => ({
    'Стіл': session.tableId,
    'Початок': formatDateTime(session.startTime),
    'Завершення': session.endTime ? formatDateTime(session.endTime) : 'Активна',
    'Тариф (₴/год)': session.hourlyRate,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Звіт');
  XLSX.writeFile(workbook, fileName);
};
