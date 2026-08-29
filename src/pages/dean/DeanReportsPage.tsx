import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { FileText, Printer, Download, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { DSA_TOPICS, TOPIC_CURRICULUM_TOTALS } from '../../data/mockData';

export const DeanReportsPage: React.FC = () => {
  const { students, teams, mentors } = useAuth();
  const [reportType, setReportType] = useState<'executive' | 'teams' | 'students'>('executive');

  const overallProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / Math.max(1, students.length));
  const totalSolved = students.reduce((acc, s) => acc + s.solved, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header (Hidden on print) */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <FileText className="w-4 h-4" />
            <span>Academic Performance Audit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Institutional Reports</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Generate formal executive accreditation digests, PDF print documents, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Formal Printable Document Card */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Institutional Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Department of Computer Science & Engineering
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gokula Krishna College of Engineering
            </h2>
            <div className="text-sm font-medium text-slate-600">
              DSA {students.length}-Student In-House Programme Performance Audit & Accreditation Report
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Doc Ref: GKCE/DSA/2026/Q2</div>
            <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-emerald-700 font-bold mt-1">Status: VERIFIED</div>
          </div>
        </div>

        {/* Executive Overview Summary */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Executive Cohort Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">Enrolled Students</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{students.length}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">Cohort Teams</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{teams.length} Teams</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">Assigned Mentors</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{mentors.length} Faculty</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500">Batch Average</div>
              <div className="text-xl font-bold text-blue-700 mt-1">{overallProgress}%</div>
            </div>
          </div>
        </div>

        {/* Topic Mastery Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Curriculum Syllabus Mastery (8 Domains)
          </h3>
          <div className="overflow-x-auto touch-scroll-x">
            <table className="w-full text-xs text-left border-collapse border border-slate-200 min-w-[500px]">
            <thead>
              <tr className="bg-slate-100 font-semibold text-slate-700">
                <th className="p-2.5 border border-slate-200">Topic Domain</th>
                <th className="p-2.5 border border-slate-200 text-center">Core Problems</th>
                <th className="p-2.5 border border-slate-200 text-center">{students.length}-Student Avg</th>
                <th className="p-2.5 border border-slate-200 text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {DSA_TOPICS.map((topic) => {
                const topicTotal = TOPIC_CURRICULUM_TOTALS[topic] ?? 0;
                // Skip topics not yet included in the current placement foundation bank
                if (topicTotal === 0) return null;
                const avg = Math.round(
                  students.reduce((sum, st) => sum + (st.topicProgress[topic]?.percentage || 0), 0) / Math.max(1, students.length)
                );
                return (
                  <tr key={topic}>
                    <td className="p-2 border border-slate-200 font-medium">{topic}</td>
                    <td className="p-2 border border-slate-200 text-center font-mono">
                      {topicTotal}
                    </td>
                    <td className="p-2 border border-slate-200 text-center font-bold">{avg}%</td>
                    <td className="p-2 border border-slate-200 text-right">
                      {avg >= 75 ? (
                        <span className="text-emerald-700 font-semibold">MEETS BENCHMARK</span>
                      ) : avg >= 60 ? (
                        <span className="text-blue-700 font-semibold">IN PROGRESS</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">NEEDS FOCUS</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Teams Performance Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. All {teams.length} Teams Status Matrix
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {teams.map((tm) => (
              <div key={tm.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{tm.teamNumber}</span>
                  <span>{tm.avgProgress}%</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{tm.mentorName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900">Sudo Users</div>
            <div className="text-slate-500">Dean of Academic Affairs & Head of Technical Training</div>
            <div className="text-slate-400 text-[10px]">Gokula Krishna College of Engineering</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-slate-900">Head of CSE Department</div>
            <div className="text-slate-500">Curriculum Quality Assurance Cell</div>
            <div className="text-slate-400 text-[10px]">Dept. of Computer Science & Engineering, GKCE</div>
          </div>
        </div>
      </div>
    </div>
  );
};
