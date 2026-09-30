import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { TopicProgressList } from '../../components/ui/TopicProgressList';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { TOTAL_CURRICULUM_PROBLEMS, ACTIVE_TOPICS_COUNT } from '../../data/mockData';
import { motion } from 'framer-motion';
import {
  User,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Radio,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/ui/SocialIcons';

export const StudentDashboard: React.FC = () => {
  const { currentUser, setActiveTab, exams } = useAuth();
  const student = currentUser.studentData;

  const liveExam = exams.find(e => e.status === 'LIVE');
  const studentSubmission = liveExam?.submissions?.find(
    s => s.studentId === student?.id || s.studentRollNo === student?.rollNo
  );

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        No student profile linked. Please switch role using the top bar.
      </div>
    );
  }

  const isSocialMissing = !student.githubUrl || !student.linkedinUrl;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 🚨 Priority Live Exam Alert Banner */}
      {liveExam && !studentSubmission && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-400/30"
        >
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <Radio className="w-6 h-6 animate-pulse text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  Active Examination
                </span>
                <span className="text-xs text-rose-100 font-semibold">Curated by Dean of Academic Affairs</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1 tracking-tight truncate">
                {liveExam.title}
              </h2>
              <p className="text-xs text-rose-100/90 mt-0.5 flex items-center gap-2 flex-wrap font-medium">
                <span>{liveExam.questions?.length || 20} Programming Problems</span>
                <span>&bull;</span>
                <span>{liveExam.durationMinutes} Minutes</span>
                <span>&bull;</span>
                <span className="text-emerald-300 font-bold">Anti-Cheating Shuffled</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('exams')}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-rose-50 text-rose-700 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Start Live Exam</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ⚠️ Mandatory Social Profiles Reminder Banner */}
      {isSocialMissing && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-4.5 rounded-3xl bg-amber-50/90 border border-amber-200/90 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-2 flex-wrap">
                <span>Action Required: Professional Accounts Pending</span>
                <span className="text-[10px] uppercase font-extrabold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">
                  Mandatory
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-800 mt-0.5 leading-relaxed">
                Connect your <strong>GitHub</strong> & <strong>LinkedIn</strong> accounts so Faculty Mentors and Root (Dean) can review your coding repositories and placement readiness.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Link Accounts Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Top Banner / Welcome with RBAC Tier 3 Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/85 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Tier 3 &bull; Enrolled Student Workspace</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
              {student.rollNo}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
            Welcome back, {student.name}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>Enrolled in <strong className="text-slate-800">{student.teamNumber}</strong></span>
            <span>•</span>
            <span>Faculty Mentor: <strong className="text-slate-800">{student.mentorName}</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">DSA Level: {student.dsaLevel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('exams')}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-indigo-200"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Weekly Exams</span>
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <Code2 className="w-4 h-4 shrink-0" />
            <span>Forge Code IDE</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid — 1-col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
        {/* 1. Profile Card */}
        <BentoCard
          title="Student Profile"
          subtitle="Academic Credentials"
          icon={<User className="w-4 h-4 text-blue-600" />}
          className="col-span-1 h-full"
        >
          <div className="flex flex-col justify-between h-full pt-1">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <UserAvatar
                  src={student.avatar}
                  name={student.name}
                  id={student.rollNo}
                  role="STUDENT"
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-slate-900 truncate leading-snug">{student.name}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">{student.rollNo}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-2">
                <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                  <span className="text-slate-500 shrink-0">Team</span>
                  <span className="font-bold text-slate-800 text-right">{student.teamNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                  <span className="text-slate-500 shrink-0">Mentor</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">{student.mentorName}</span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-50">
                  <span className="text-slate-500 shrink-0">DSA Level</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] border border-blue-100/60">
                    {student.dsaLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-slate-500 shrink-0">Status</span>
                  <StatusBadge status={student.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Professional Accounts (GitHub & LinkedIn) */}
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Professional Accounts
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {student.githubUrl ? (
                  <a
                    href={student.githubUrl.startsWith('http') ? student.githubUrl : `https://${student.githubUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between text-slate-800 transition-colors group"
                    title={student.githubUrl}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <GithubIcon className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                      <span className="text-[11px] font-semibold truncate">GitHub</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  </a>
                ) : (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-1.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200 text-rose-700 flex items-center justify-between transition-colors text-left cursor-pointer"
                    title="GitHub not connected. Click to link"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <GithubIcon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="text-[11px] font-semibold truncate">+ GitHub</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase bg-rose-200/60 px-1 rounded">Required</span>
                  </button>
                )}

                {student.linkedinUrl ? (
                  <a
                    href={student.linkedinUrl.startsWith('http') ? student.linkedinUrl : `https://${student.linkedinUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-200/80 flex items-center justify-between text-blue-900 transition-colors group"
                    title={student.linkedinUrl}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <LinkedinIcon className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span className="text-[11px] font-semibold truncate">LinkedIn</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-blue-500 group-hover:text-blue-700 shrink-0" />
                  </a>
                ) : (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-between transition-colors text-left cursor-pointer"
                    title="LinkedIn not connected. Click to link"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <LinkedinIcon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="text-[11px] font-semibold truncate">+ LinkedIn</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase bg-amber-200/60 px-1 rounded">Required</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 2. Progress Card */}
        <BentoCard
          title="DSA Progress"
          subtitle="Curriculum Completion"
          icon={<Sparkles className="w-4 h-4 text-blue-600" />}
          action={
            <button
              onClick={() => setActiveTab('my-progress')}
              className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
              title="View full progress"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          }
          className="col-span-1 h-full"
        >
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="flex flex-col items-center justify-center my-auto py-2">
              <ProgressRing
                percentage={student.progress}
                size={116}
                strokeWidth={10}
                label="Completed"
                subLabel="Overall Target"
              />
              <div className="text-center mt-2.5">
                <div className="text-sm font-bold text-slate-900">{student.progress}% DSA Progress</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {student.solved} of {TOTAL_CURRICULUM_PROBLEMS} problems mastered
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center justify-between text-xs mt-3">
              <span className="text-slate-600 font-medium">Curriculum Goal</span>
              <span className="font-bold text-blue-700 font-mono">{student.solved} / 100</span>
            </div>
          </div>
        </BentoCard>

        {/* 3. Problems Card */}
        <BentoCard
          title="Problems Summary"
          subtitle="Solve Metrics"
          icon={<Code2 className="w-4 h-4 text-emerald-600" />}
          className="col-span-1 h-full"
        >
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex flex-col justify-between">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Solved</div>
                <div className="text-lg font-bold text-emerald-900 mt-0.5 font-mono">{student.solved}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-100 flex flex-col justify-between">
                <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Attempted</div>
                <div className="text-lg font-bold text-blue-900 mt-0.5 font-mono">{student.attempted}</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100/80 border border-slate-200 flex flex-col justify-between">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Pending</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5 font-mono">{student.pending}</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2 mt-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Accuracy Rate</span>
                <span className="font-bold text-slate-900 font-mono">
                  {Number(((student.solved / Math.max(1, student.attempted)) * 100).toFixed(1))}%
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Practiced</span>
                <span className="font-bold text-emerald-700 font-mono">{student.attempted} Problems</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 4. Streak Card */}
        <BentoCard
          title="Activity Streak"
          subtitle="Consistency Meter"
          icon={<Flame className="w-4 h-4 text-amber-500" />}
          className="col-span-1 h-full"
        >
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="flex justify-center py-1">
              <StreakBadge streak={student.streak} size="lg" />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2 mt-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>Current Streak</span>
                <span className="font-bold text-amber-600 font-mono">{student.streak} Days</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Longest Streak</span>
                <span className="font-bold text-slate-800 font-mono">{student.longestStreak} Days</span>
              </div>
              <div className="text-[11px] text-slate-500 border-t border-slate-200/80 pt-1.5 flex items-center justify-between">
                <span>Consistency Level</span>
                <span className="font-bold text-emerald-600">
                  {student.streak === 0 ? 'Not Started' : student.streak >= 10 ? 'High' : student.streak >= 5 ? 'Moderate' : 'Building'}
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 5. Topics Card (1 col on mobile, 2 cols on sm+) */}
        <BentoCard
          title="DSA Topics Breakdown"
          subtitle={`${ACTIVE_TOPICS_COUNT} Core Curriculum Domains`}
          icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
          action={
            <button
              onClick={() => setActiveTab('my-progress')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Detailed View →
            </button>
          }
          className="col-span-1 sm:col-span-2 lg:col-span-2 h-full"
        >
          <div className="pt-2">
            <TopicProgressList topicProgress={student.topicProgress} />
          </div>
        </BentoCard>

        {/* 6. Activity Card (1 col on mobile, 2 cols on sm+) */}
        <BentoCard
          title="Recent Activity"
          subtitle="Latest Solved Problems & Submissions"
          icon={<Clock className="w-4 h-4 text-slate-600" />}
          action={
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Full Log →
            </button>
          }
          className="col-span-1 sm:col-span-2 lg:col-span-2 h-full"
        >
          <div className="flex flex-col justify-between h-full pt-1">
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {student.recentActivities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No activity recorded yet. Click <strong>Solve Problems</strong> above to start your practice!
                </div>
              ) : (
                student.recentActivities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="p-3 sm:p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.status === 'Attempted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {act.status === 'Attempted' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {act.action} {act.problemTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {act.topic} • {act.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-slate-700 block">{act.timeAgo}</span>
                      <span className={`text-[10px] font-bold block ${act.status === 'Attempted' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {act.status === 'Attempted' ? 'Attempted' : 'Passed Test Cases'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{student.solved} Verified Problems Mastered</span>
              </div>
              <button
                onClick={() => setActiveTab('problems')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Practice Arena</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
