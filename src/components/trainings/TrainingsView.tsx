import React, { useState } from 'react';
import { User, TrainingProgram, TrainingCategory } from '../../types';
import {
  GraduationCap,
  Plus,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  BookOpen,
  Filter,
  Search,
} from 'lucide-react';

interface TrainingsViewProps {
  currentUser: User;
  trainings: TrainingProgram[];
  onToggleEnroll: (trainingId: string) => void;
  onCreateTraining: (data: {
    title: string;
    category: TrainingCategory;
    instructor: string;
    durationHours: number;
    scheduleDate: string;
    maxParticipants: number;
    description: string;
    learningOutcomes: string[];
  }) => void;
}

export const TrainingsView: React.FC<TrainingsViewProps> = ({
  currentUser,
  trainings,
  onToggleEnroll,
  onCreateTraining,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<TrainingCategory>('Technical');
  const [formInstructor, setFormInstructor] = useState('');
  const [formDuration, setFormDuration] = useState('8');
  const [formDate, setFormDate] = useState('');
  const [formMax, setFormMax] = useState('30');
  const [formDesc, setFormDesc] = useState('');
  const [formOutcomes, setFormOutcomes] = useState('Build enterprise systems, Enforce architectural standards');

  const filtered = trainings.filter((t) => {
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formInstructor.trim() || !formDate) return;

    onCreateTraining({
      title: formTitle.trim(),
      category: formCategory,
      instructor: formInstructor.trim(),
      durationHours: Number(formDuration) || 4,
      scheduleDate: formDate,
      maxParticipants: Number(formMax) || 25,
      description: formDesc.trim(),
      learningOutcomes: formOutcomes.split(',').map((o) => o.trim()).filter(Boolean),
    });

    setIsModalOpen(false);
    setFormTitle('');
    setFormInstructor('');
    setFormDate('');
    setFormDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Training & Professional Development</h2>
          <p className="text-xs text-slate-500 mt-1">
            Skill enhancement workshops, mandatory compliance accreditations, and technical modules.
          </p>
        </div>

        {(currentUser.role === 'hr' || currentUser.role === 'manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Program</span>
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
            placeholder="Search workshops, instructors, or topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Discipline:</span>
          </div>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="All">All Disciplines</option>
            <option value="Technical">Technical</option>
            <option value="Compliance">Compliance</option>
            <option value="Leadership">Leadership</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((program) => {
          const isEnrolled = program.enrolledEmployeeIds.includes(currentUser.employeeId);
          const isFull = program.enrolledEmployeeIds.length >= program.maxParticipants;
          const seatPct = Math.round((program.enrolledEmployeeIds.length / program.maxParticipants) * 100);

          return (
            <div
              key={program.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {program.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 font-mono">
                    {program.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                  {program.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {program.description}
                </p>

                {/* Key metadata */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">Instructor: {program.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {program.durationHours} Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date: {program.scheduleDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Seats: {program.enrolledEmployeeIds.length} / {program.maxParticipants}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, seatPct)}%` }}
                    />
                  </div>
                </div>

                {/* Outcomes */}
                {program.learningOutcomes && program.learningOutcomes.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                      Key Competencies Acquired:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-500 list-disc list-inside">
                      {program.learningOutcomes.map((o, idx) => (
                        <li key={idx} className="line-clamp-1">{o}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs font-mono text-slate-500">
                  {isEnrolled ? (
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <span>{program.maxParticipants - program.enrolledEmployeeIds.length} seats available</span>
                  )}
                </div>

                <button
                  onClick={() => onToggleEnroll(program.id)}
                  disabled={!isEnrolled && isFull}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isEnrolled
                      ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                      : isFull
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isEnrolled ? 'Withdraw Enrollment' : isFull ? 'Class Full' : 'Enroll in Program'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Schedule Training Program</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Advanced Incident Management & Site Reliability"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discipline</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TrainingCategory)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor / Provider</label>
                  <input
                    type="text"
                    required
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                    placeholder="e.g. AWS Certified Specialist"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formMax}
                    onChange={(e) => setFormMax(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Syllabus Overview</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Outline syllabus, prerequisites, and target audience..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Learning Outcomes (comma separated)</label>
                <input
                  type="text"
                  value={formOutcomes}
                  onChange={(e) => setFormOutcomes(e.target.value)}
                  placeholder="e.g. Handle high-severity incidents, Root cause post-mortems"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
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
                  Save & Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
