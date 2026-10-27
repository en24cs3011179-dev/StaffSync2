import React, { useState } from 'react';
import { User, Announcement, AnnouncementCategory, PriorityLevel } from '../../types';
import {
  Megaphone,
  Plus,
  Pin,
  Trash2,
  Search,
  Filter,
  X,
  AlertTriangle,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

interface AnnouncementsViewProps {
  currentUser: User;
  announcements: Announcement[];
  onCreateAnnouncement: (data: {
    title: string;
    category: AnnouncementCategory;
    content: string;
    targetRole: Announcement['targetRole'];
    priority: PriorityLevel;
    isPinned?: boolean;
  }) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  currentUser,
  announcements,
  onCreateAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<AnnouncementCategory>('General');
  const [formContent, setFormContent] = useState('');
  const [formPriority, setFormPriority] = useState<PriorityLevel>('Medium');
  const [formTargetRole, setFormTargetRole] = useState<Announcement['targetRole']>('All');
  const [formPinned, setFormPinned] = useState(false);

  const filtered = announcements.filter((a) => {
    const matchesCat = selectedCat === 'All' || a.category === selectedCat;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    onCreateAnnouncement({
      title: formTitle.trim(),
      category: formCategory,
      content: formContent.trim(),
      targetRole: formTargetRole,
      priority: formPriority,
      isPinned: formPinned,
    });

    setIsModalOpen(false);
    setFormTitle('');
    setFormContent('');
    setFormPinned(false);
  };

  const getPriorityStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Company Announcements & Bulletins</h2>
          <p className="text-xs text-slate-500 mt-1">
            Official communications, regulatory policy amendments, and executive notices.
          </p>
        </div>

        {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements by title or content..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Policy">Policy</option>
            <option value="Holiday">Holiday</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Feed of Announcements */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-400">
            No announcements found matching the filter criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-5 border transition-all ${
                item.isPinned ? 'border-indigo-300 ring-1 ring-indigo-100 shadow-xs' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {item.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      <Pin className="w-3 h-3 fill-indigo-600" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getPriorityStyle(item.priority)}`}>
                    {item.priority} Priority
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">Audience: {item.targetRole}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{item.publishedAt}</span>
                  {currentUser.role === 'hr' && (
                    <button
                      onClick={() => onDeleteAnnouncement(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  Published by <span className="font-semibold text-slate-700">{item.authorName}</span> ({item.authorRole})
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Publish Company Announcement</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Q4 Town Hall and Compensation Review"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Policy">Policy</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as PriorityLevel)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formTargetRole}
                    onChange={(e) => setFormTargetRole(e.target.value as Announcement['targetRole'])}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="All">All Staff</option>
                    <option value="Employee">Employees</option>
                    <option value="Manager">Managers</option>
                    <option value="HR">HR Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Draft announcement details, timelines, and links..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinToTop"
                  checked={formPinned}
                  onChange={(e) => setFormPinned(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinToTop" className="text-xs text-slate-700 select-none">
                  Pin this announcement to top of feed
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
