import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { Settings, Save, Bell, Shield, BookOpen, Clock, Check } from 'lucide-react';
import { DSA_TOPICS } from '../../data/mockData';

export const DeanSettingsPage: React.FC = () => {
  const { students, teams } = useAuth();
  const [academicTerm, setAcademicTerm] = useState('Academic Year 2025-26 (Spring Semester)');
  const [minPassThreshold, setMinPassThreshold] = useState(70);
  const [alertLowActivityDays, setAlertLowActivityDays] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform & Curriculum Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Manage institutional grading criteria, DSA curriculum milestones, and notification rules.
          </p>
        </div>

        <div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            {isSaved ? 'Settings Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Academic Term Configuration */}
        <BentoCard
          title="Academic Term & Cohort Rules"
          subtitle="Institution Standards"
          icon={<Shield className="w-4 h-4 text-blue-600" />}
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Active Academic Session
              </label>
              <input
                type="text"
                value={academicTerm}
                onChange={(e) => setAcademicTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Enrolled Students
                </label>
                <input
                  type="text"
                  disabled
                  value={`${students.length} Students`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Cohorts / Teams
                </label>
                <input
                  type="text"
                  disabled
                  value={`${teams.length} Teams`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono"
                />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Evaluation Thresholds */}
        <BentoCard
          title="Milestone & Risk Thresholds"
          subtitle="Autonomous Evaluation Benchmarks"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
        >
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Minimum Target Completion</span>
                <span className="font-bold text-blue-700">{minPassThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={minPassThreshold}
                onChange={(e) => setMinPassThreshold(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="text-[11px] text-slate-400 mt-1">
                Students below this threshold are automatically flagged as &ldquo;Needs Attention&rdquo;.
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Inactivity Alert Threshold</span>
                <span className="font-bold text-amber-700">{alertLowActivityDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={alertLowActivityDays}
                onChange={(e) => setAlertLowActivityDays(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-[11px] text-slate-400 mt-1">
                Trigger mentor notification when no problems solved in this duration.
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 8 Topics Weightage */}
        <div className="col-span-1 md:col-span-2">
          <BentoCard
            title="Curriculum Syllabus Weightage (8 Core Modules)"
            subtitle="Autonomous DSA Subject Matrix"
            icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {DSA_TOPICS.map((topic) => (
                <div key={topic} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{topic}</div>
                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Target:</span>
                    <span className="font-mono font-semibold text-blue-700">100% Mastery</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};
