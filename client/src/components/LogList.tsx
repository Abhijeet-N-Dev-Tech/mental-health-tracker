import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import LogCard from './LogCard';
import { Log } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 5;

export default function LogList({ refetchSignal }: { refetchSignal: boolean }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchLogs = useCallback(async () => {
    const res = await axios.get<{ rows: Log[] }>(`${API_BASE}/logs`);
    setLogs(res.data.rows);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, refetchSignal]);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentLogs = logs.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(logs.length / ITEMS_PER_PAGE);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const renderPagination = () => {
    return pageCount > 1 && (
      <ReactPaginate
        pageCount={pageCount}
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        previousLabel="←"
        nextLabel="→"
        breakLabel="..."
        renderOnZeroPageCount={null}
        containerClassName="flex justify-center gap-2 mt-6"
        pageLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
        activeLinkClassName="bg-blue-600 text-white font-semibold"
        previousLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
        nextLinkClassName="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
        breakLinkClassName="px-3 py-1"
        disabledLinkClassName="opacity-50 cursor-not-allowed"
      />
    )
  }

  return (
    <div className="space-y-4">
      {logs.length === 0 && <p>No logs available.</p>}
      {renderPagination()}
      {currentLogs.map((log) => (
        <LogCard key={log.id} log={log} />
      ))}
      {renderPagination()}
    </div>
  );
}
