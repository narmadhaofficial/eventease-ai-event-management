import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChecklistTask } from '../types';
import {
  CheckSquare,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChecklistView: React.FC = () => {
  const { activeEvent, checklist, updateChecklistTask, addChecklistTask } = useApp();

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTimeframe, setNewTaskTimeframe] = useState('1 Month Before');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const timeframes = [
    'All',
    '6 Months Before',
    '3 Months Before',
    '1 Month Before',
    '1 Week Before',
    '1 Day Before',
    'Event Day',
  ];

  const filteredTasks =
    selectedTimeframe === 'All'
      ? checklist
      : checklist.filter((t) => t.timeframe === selectedTimeframe);

  const completedCount = checklist.filter((t) => t.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / Math.max(1, checklist.length)) * 100);

  const toggleTaskStatus = async (task: ChecklistTask) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await updateChecklistTask({ ...task, status: nextStatus });
    if (nextStatus === 'Completed') {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 },
      });
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addChecklistTask({
      title: newTaskTitle,
      timeframe: newTaskTimeframe as any,
      category: newTaskCategory,
      description: newTaskDesc,
      status: 'Pending',
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              Event Timeline & Milestones
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Event Execution Checklist</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Synchronized milestones from 6 months before to the grand event day.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-stone-700">Checklist Completion Status</span>
            <span className="text-amber-800">
              {completedCount} of {checklist.length} Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeframe Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setSelectedTimeframe(tf)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedTimeframe === tf
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Checklist Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
            No tasks in this timeframe. Click "Add Custom Task" to schedule one!
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';
            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? 'bg-stone-50/70 border-stone-200 opacity-75'
                    : 'bg-white border-stone-200 hover:border-amber-300 shadow-xs'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white hover:border-amber-500'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                      {task.timeframe}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                      {task.category}
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-bold ${
                      isDone ? 'line-through text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{task.description}</p>
                  )}
                </div>

                <div className="hidden sm:block text-right shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">Add Event Checklist Item</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Schedule Bridal Trial Makeup"
                  className="w-full text-xs border border-stone-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Timeframe</label>
                  <select
                    value={newTaskTimeframe}
                    onChange={(e) => setNewTaskTimeframe(e.target.value)}
                    className="w-full text-xs border border-stone-300 rounded-xl p-2.5 bg-white"
                  >
                    <option value="6 Months Before">6 Months Before</option>
                    <option value="3 Months Before">3 Months Before</option>
                    <option value="1 Month Before">1 Month Before</option>
                    <option value="1 Week Before">1 Week Before</option>
                    <option value="1 Day Before">1 Day Before</option>
                    <option value="Event Day">Event Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full text-xs border border-stone-300 rounded-xl p-2.5 bg-white"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Decor">Decor</option>
                    <option value="Catering">Catering</option>
                    <option value="Photography">Photography</option>
                    <option value="Styling">Styling</option>
                    <option value="Invitations">Invitations</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Optional details or vendor contact reminders..."
                  className="w-full text-xs border border-stone-300 rounded-xl p-2.5 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
