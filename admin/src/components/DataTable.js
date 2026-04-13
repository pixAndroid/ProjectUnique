'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function DataTable({ columns, data, onEdit, onDelete, pageSize = 10 }) {
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const total = data.length;
  const pages = Math.ceil(total / pageSize);
  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-3 px-4 text-slate-400 font-medium">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr key={row._id || i} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-slate-300">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(row._id)}
                            className={`p-1.5 rounded transition-colors ${
                              deleteConfirm === row._id
                                ? 'text-white bg-red-600'
                                : 'text-slate-400 hover:text-red-400 hover:bg-red-400/10'
                            }`}
                            title={deleteConfirm === row._id ? 'Click again to confirm' : 'Delete'}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
          <span className="text-sm text-slate-400">
            Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-2.5 py-1 rounded text-sm transition-colors ${
                  page === i + 1 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
