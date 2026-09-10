import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';

const INITIAL_TRASH = [
  { id: 1, name: 'AOL_500_Hours_Free_Trial.exe', size: '1.44 MB', date: '04/12/1998', icon: '💿' },
  { id: 2, name: 'Internet_Explorer_3.0_Setup.exe', size: '12.8 MB', date: '02/10/1997', icon: '🌐' },
  { id: 3, name: 'Clippy_Assistant_Helper.dll', size: '340 KB', date: '11/08/1998', icon: '📎' },
  { id: 4, name: 'Y2K_Bug_Fear_Article.doc', size: '48 KB', date: '09/01/1998', icon: '📝' },
  { id: 5, name: 'Dancing_Baby_3D_GIF.gif', size: '820 KB', date: '07/15/1998', icon: '👶' },
];

export default function RecycleBinApp() {
  const [trashItems, setTrashItems] = useState(INITIAL_TRASH);

  const handleEmpty = () => {
    soundManager.playExplosion();
    setTrashItems([]);
  };

  const handleRestore = () => {
    soundManager.playClick();
    setTrashItems(INITIAL_TRASH);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--window-bg)] text-[var(--text-main)] p-2 font-mono text-xs select-none overflow-y-auto">
      {/* Action Toolbar */}
      <div className="bevel-raised p-1.5 bg-[var(--btn-face)] mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleEmpty}
            disabled={trashItems.length === 0}
            className="bevel-button px-2.5 py-1 text-xs font-bold hover:bg-red-700 hover:text-white disabled:opacity-50"
          >
            🗑️ Empty Recycle Bin
          </button>
          <button
            type="button"
            onClick={handleRestore}
            className="bevel-button px-2.5 py-1 text-xs font-bold hover:bg-blue-700 hover:text-white"
          >
            ♻️ Restore All
          </button>
        </div>
        <div className="text-[11px] opacity-75">{trashItems.length} item(s) in bin</div>
      </div>

      {/* Trash Table */}
      <div className="bevel-sunken flex-1 bg-white text-black p-2 overflow-y-auto">
        {trashItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-10">
            <span className="text-4xl mb-2">✨</span>
            <div className="font-bold text-sm">Recycle Bin is empty!</div>
            <div className="text-[11px]">No deleted cyberspace artifacts remain.</div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-400 text-[11px] font-bold text-gray-700">
                <th className="pb-1">Name</th>
                <th className="pb-1">Original Size</th>
                <th className="pb-1">Date Deleted</th>
              </tr>
            </thead>
            <tbody>
              {trashItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-100 cursor-pointer border-b border-gray-100"
                >
                  <td className="py-1.5 flex items-center gap-1.5 truncate">
                    <span className="text-base">{item.icon}</span>
                    <span className="font-bold text-blue-900 truncate">{item.name}</span>
                  </td>
                  <td className="py-1.5 text-gray-600">{item.size}</td>
                  <td className="py-1.5 text-gray-600">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
