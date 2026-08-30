import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BentoCard } from '../../components/ui/BentoCard';
import { DSA_TOPICS, TOPIC_CURRICULUM_TOTALS, DIFFICULTY_TOTALS } from '../../data/mockData';
import { BarChart3, PieChart as PieChartIcon, Activity, Layers, Target, Trophy, Flame } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const DeanAnalyticsPage: React.FC = () => {
  const { students, teams } = useAuth();

  // 1. Topic Performance Data (All active curriculum topics)
  const topicData = useMemo(() => {
    return DSA_TOPICS.filter(t => (TOPIC_CURRICULUM_TOTALS[t] ?? 0) > 0).map(topic => {
      const totalSolved = students.reduce((sum, s) => sum + (s.topicProgress[topic]?.solved || 0), 0);
      const avgPercentage = students.length > 0
        ? Number((students.reduce((sum, s) => sum + (s.topicProgress[topic]?.percentage || 0), 0) / students.length).toFixed(1))
        : 0;
      return {
        name: topic,
        TotalSolved: totalSolved,
        AverageMastery: avgPercentage,
        CurriculumCap: TOPIC_CURRICULUM_TOTALS[topic] || 0
      };
    });
  }, [students]);

  // 2. Status Distribution Data
  const statusData = useMemo(() => {
    const active = students.filter(s => s.status === 'Active').length;
    const attention = students.filter(s => s.status === 'Needs Attention').length;
    const inactive = students.filter(s => s.status === 'Inactive').length;
    const data = [
      { name: 'Active', value: active, color: '#10b981' },
      { name: 'Needs Attention', value: attention, color: '#f59e0b' },
      { name: 'Inactive', value: inactive, color: '#94a3b8' }
    ].filter(d => d.value > 0);

    return data.length > 0 ? data : [{ name: 'No Students', value: 1, color: '#cbd5e1' }];
  }, [students]);

  // 3. Team Velocity Data
  const teamVelocityData = useMemo(() => {
    return teams.map(t => {
      const teamSts = students.filter(s => s.teamId === t.id || s.teamNumber === t.teamNumber);
      const avgProg = teamSts.length > 0 ? Number((teamSts.reduce((sum, s) => sum + s.progress, 0) / teamSts.length).toFixed(1)) : 0;
      return {
        name: t.teamNumber,
        Progress: avgProg,
        Students: teamSts.length
      };
    });
  }, [teams, students]);

  // 4. Difficulty Solves Comparison
  const difficultyData = useMemo(() => {
    const easySolved = students.reduce((sum, s) => sum + (s.difficultyStats?.easy?.solved || 0), 0);
    const medSolved = students.reduce((sum, s) => sum + (s.difficultyStats?.medium?.solved || 0), 0);
    const hardSolved = students.reduce((sum, s) => sum + (s.difficultyStats?.hard?.solved || 0), 0);
    const totalPossibleEasy = Math.max(1, students.length * DIFFICULTY_TOTALS.easy);
    const totalPossibleMed = Math.max(1, students.length * DIFFICULTY_TOTALS.medium);
    const totalPossibleHard = Math.max(1, students.length * DIFFICULTY_TOTALS.hard);

    return [
      {
        tier: 'Easy',
        Solved: easySolved,
        Capacity: totalPossibleEasy,
        Percentage: Number(((easySolved / totalPossibleEasy) * 100).toFixed(1)),
        fill: '#10b981'
      },
      {
        tier: 'Medium',
        Solved: medSolved,
        Capacity: totalPossibleMed,
        Percentage: Number(((medSolved / totalPossibleMed) * 100).toFixed(1)),
        fill: '#f59e0b'
      },
      {
        tier: 'Hard',
        Solved: hardSolved,
        Capacity: totalPossibleHard,
        Percentage: Number(((hardSolved / totalPossibleHard) * 100).toFixed(1)),
        fill: '#ef4444'
      }
    ];
  }, [students]);

  // 5. DSA Level Segmentation
  const levelData = useMemo(() => {
    const mastery = students.filter(s => s.dsaLevel === 'Mastery').length;
    const advanced = students.filter(s => s.dsaLevel === 'Advanced').length;
    const intermediate = students.filter(s => s.dsaLevel === 'Intermediate').length;
    const beginner = students.filter(s => s.dsaLevel === 'Beginner').length;

    return [
      { name: 'Mastery (>=85%)', value: mastery, color: '#8b5cf6' },
      { name: 'Advanced (65-84%)', value: advanced, color: '#3b82f6' },
      { name: 'Intermediate (40-64%)', value: intermediate, color: '#06b6d4' },
      { name: 'Beginner (<40%)', value: beginner, color: '#64748b' }
    ].filter(d => d.value > 0);
  }, [students]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Banner */}
      <div className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
            <PieChartIcon className="w-4 h-4" />
            <span>Institution-Wide Visual Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Macro Data Visualization</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Visual breakdown of topic syllabus mastery, student engagement segmentation, and team velocity across {students.length} students.
          </p>
        </div>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Topic Mastery Bar Chart */}
        <BentoCard
          title="Topic Syllabus Mastery"
          subtitle="Average completion rate (%) per DSA module"
          icon={<BarChart3 className="w-4 h-4 text-blue-600" />}
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickMargin={10} angle={-40} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  formatter={(val: any) => [`${val}%`, 'Cohort Average']}
                />
                <Bar dataKey="AverageMastery" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Average Mastery %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Difficulty Solves Tier Bar Chart */}
        <BentoCard
          title="Complexity Tier Distribution"
          subtitle="Cohort completion % by problem difficulty tier"
          icon={<Target className="w-4 h-4 text-emerald-600" />}
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="tier" tick={{ fontSize: 11, fontWeight: 'bold' }} tickMargin={10} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  formatter={(val: any) => [`${val}%`, 'Tier Completion']}
                />
                <Bar dataKey="Percentage" radius={[6, 6, 0, 0]} name="Completion %">
                  {difficultyData.map((entry, index) => (
                    <Cell key={`diff-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Cohort Status Distribution */}
        <BentoCard
          title="Engagement Segmentation"
          subtitle="Active vs At-Risk Student Breakdown"
          icon={<PieChartIcon className="w-4 h-4 text-amber-600" />}
        >
          <div className="h-[300px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* DSA Level Distribution */}
        <BentoCard
          title="DSA Skill Level Matrix"
          subtitle="Mastery tier classification across cohort"
          icon={<Trophy className="w-4 h-4 text-purple-600" />}
        >
          <div className="h-[300px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData.length > 0 ? levelData : [{ name: 'Beginner', value: 1, color: '#64748b' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${(name || 'Tier').split(' ')[0]} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-level-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Team Velocity Comparison */}
        <BentoCard
          title="Mentored Cohort Velocity Comparison"
          subtitle="Average progress trajectory across all institutional teams"
          className="col-span-1 lg:col-span-2"
          icon={<Activity className="w-4 h-4 text-indigo-600" />}
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teamVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickMargin={10} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  formatter={(val: any) => [`${val}%`, 'Team Avg Progress']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="Progress"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#6366f1' }}
                  activeDot={{ r: 7 }}
                  name="Avg Progress %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};
