
// import React, { useEffect, useState } from 'react';
// import {
//   Users, Clock, TrendingUp, RefreshCw, ArrowUpRight,
//   Calendar, Zap, BarChart2, Activity, Sun, Moon, Store
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   CartesianGrid, Cell, RadialBarChart, RadialBar, PolarAngleAxis,
//   LineChart, Line, Legend, ComposedChart, Area
// } from 'recharts';
// import './Dashboard.css';
// const API_BASE= import.meta.env.VITE_API_URL;

// const DEFAULT = {
//   footfall: 0, openingTime: 'N/A', closingTime: 'N/A',
//   busiestDay: '--', busiestHour: '--',
//   malePercent: 0, femalePercent: 0, malePeak: '--', femalePeak: '--',
//   ageGroups: {}, genderAge: {}, entryCount: 0,
//   hourlyTraffic: {}, yesterdayHourlyTraffic: {},
//   mostVisitedAgeGroup: '--',
//   weekdayVsWeekend: { weekday: 0, weekend: 0 },
//   last7Days: [],
// };

// const AGE_COLORS = ['#00d4ff', '#7b61ff', '#ff6b9d', '#ffb347'];

// const ChartTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="dash-tooltip">
//       <p className="dash-tooltip__label">{label}</p>
//       {payload.map((p, i) => (
//         <p key={i} style={{ color: p.stroke || p.fill || p.color }}>
//           {p.name}: <strong>{p.value}</strong>
//         </p>
//       ))}
//     </div>
//   );
// };

// const StatCard = ({ icon: Icon, label, value, colorClass, trend, sub }) => (
//   <div className={`stat-card ${colorClass}`}>
//     <div className="stat-card__glow" />
//     <div className="stat-card__icon"><Icon size={15} /></div>
//     <div className="stat-card__body">
//       <p className="stat-card__label">{label}</p>
//       <h2 className="stat-card__value">{value}</h2>
//       {sub && <p className="stat-card__sub">{sub}</p>}
//     </div>
//   </div>
// );

// const GenderCombinedCard = ({ maleCount, femaleCount }) => (
//   <div className="flow-card-combined">
//     <div className="flow-combined__side flow-combined__male">
//       <div className="flow-combined__icon flow-combined__icon--male">
//         <Users size={18} />
//       </div>
//       <div>
//         <p className="flow-card__label">Total Male</p>
//         <h2 className="flow-combined__count flow-combined__count--male">
//           {maleCount.toLocaleString()}
//         </h2>
//       </div>
//     </div>
//     <div className="flow-combined__divider" />
//     <div className="flow-combined__side flow-combined__female">
//       <div className="flow-combined__icon flow-combined__icon--female">
//         <Users size={18} />
//       </div>
//       <div>
//         <p className="flow-card__label">Total Female</p>
//         <h2 className="flow-combined__count flow-combined__count--female">
//           {femaleCount.toLocaleString()}
//         </h2>
//       </div>
//     </div>
//   </div>
// );

// const GaugeChart = ({ percent, color, label }) => (
//   <div className="gauge">
//     <div className="gauge__svg-wrap">
//       <ResponsiveContainer width={120} height={120}>
//         <RadialBarChart
//           cx="50%" cy="50%"
//           innerRadius="62%" outerRadius="88%"
//           startAngle={210} endAngle={-30}
//           data={[{ value: percent, fill: color }]}
//         >
//           <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
//           <RadialBar
//             dataKey="value"
//             cornerRadius={8}
//             background={{ fill: 'rgba(255,255,255,0.04)' }}
//           />
//         </RadialBarChart>
//       </ResponsiveContainer>
//       <div className="gauge__center">
//         <span className="gauge__pct" style={{ color }}>{percent}%</span>
//         <span className="gauge__label">{label}</span>
//       </div>
//     </div>
//   </div>
// );

// const sortHours = (entries) =>
//   entries
//     .map(([hour, counts]) => ({
//       hour,
//       ...(typeof counts === 'object' ? counts : { entry: counts, exit: 0 }),
//       _sort: (() => {
//         const parts = (hour || '').trim().split(' ');
//         if (parts.length < 2) return 0;
//         const [h, period] = parts;
//         let n = parseInt(h, 10);
//         if (period === 'PM' && n !== 12) n += 12;
//         if (period === 'AM' && n === 12) n = 0;
//         return n;
//       })(),
//     }))
//     .sort((a, b) => a._sort - b._sort);

// export default function Dashboard() {
//   const [data, setData] = useState(DEFAULT);
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLast] = useState(null);
//   const [stores, setStores] = useState([]);
//   const todayStr = new Date().toISOString().split('T')[0];
//   const [activeDate, setActiveDate] = useState(todayStr);
//   const [activeStore, setActiveStore] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);

//   const getToken = () => localStorage.getItem('token');
//   const getIsAdmin = () => {
//     const stored = localStorage.getItem('is_admin');
//     if (stored !== null) return stored === 'true';
//     const token = localStorage.getItem('token');
//     if (!token) return false;
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.is_admin === true;
//     } catch {
//       return false;
//     }
//   };

//   const fetchStores = async () => {
//     const token = getToken();
//     if (!token) return;
//     setIsAdmin(getIsAdmin());
//     try {
//       const res = await fetch(`${API_BASE}/api/stores`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.ok) {
//         const json = await res.json();
//         setStores(json);
//         if (json.length > 0) {
//           setActiveStore(prev => prev || json[0].store_name);
//         }
//       }
//     } catch (err) {
//       console.error('Failed to fetch stores');
//     }
//   };

//   const fetchData = async (storeOverride) => {
//     const token = getToken();
//     if (!token) {
//       console.error("No token found - Please login");
//       return;
//     }

//     const storeToFetch = storeOverride !== undefined ? storeOverride : activeStore;
//     if (!storeToFetch) return;

//     setLoading(true);
//     try {
//       const url = `${API_BASE}/api/dashboard_stats?date=${activeDate}&store=${encodeURIComponent(storeToFetch)}`;
//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.status === 401) {
//         console.error("Unauthorized - Please login again");
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//         return;
//       }

//       if (res.ok) {
//         const json = await res.json();
//         setData(json);
//         setLast(new Date().toLocaleTimeString());
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       fetchStores();
//     }
//   }, []);

//   useEffect(() => {
//     if (!activeStore) return;
//     const token = getToken();
//     if (!token) return;

//     fetchData();
//     let id;
//     if (activeDate === todayStr) {
//       id = setInterval(() => fetchData(), 5000);
//     }
//     return () => clearInterval(id);
//   }, [activeDate, activeStore]);

//   const ageData = Object.entries(data.ageGroups || {}).map(([k, v]) => ({ name: k, value: v }));
//   const genderAgeData = Object.entries(data.genderAge || {}).map(([k, v]) => ({
//     name: k, male: v.male || 0, female: v.female || 0,
//   }));

//   const todaySorted = sortHours(Object.entries(data.hourlyTraffic || {}));
//   const yesterdaySorted = sortHours(Object.entries(data.yesterdayHourlyTraffic || {}));

//   const allHours = [...new Set([
//     ...todaySorted.map((d) => d.hour),
//     ...yesterdaySorted.map((d) => d.hour),
//   ])].sort((a, b) => {
//     const parse = (h) => {
//       const parts = (h || '').trim().split(' ');
//       if (parts.length < 2) return 0;
//       let n = parseInt(parts[0], 10);
//       if (parts[1] === 'PM' && n !== 12) n += 12;
//       if (parts[1] === 'AM' && n === 12) n = 0;
//       return n;
//     };
//     return parse(a) - parse(b);
//   });

//   const todayMap = Object.fromEntries(todaySorted.map((d) => [d.hour, d.entry ?? 0]));
//   const yesterdayMap = Object.fromEntries(yesterdaySorted.map((d) => [d.hour, d.entry ?? 0]));

//   const combinedHourly = allHours.map((hour) => ({
//     hour,
//     today: todayMap[hour] ?? 0,
//     yesterday: yesterdayMap[hour] ?? 0,
//   }));

//   const totalMale = Object.values(data.genderAge || {}).reduce((s, g) => s + (g.male || 0), 0);
//   const totalFemale = Object.values(data.genderAge || {}).reduce((s, g) => s + (g.female || 0), 0);

//   const { weekday = 0, weekend = 0 } = data.weekdayVsWeekend || {};
//   const last7 = data.last7Days || [];
//   const isToday = activeDate === todayStr;

//   const chartTitle = isToday
//     ? "Hourly Entry Traffic Today vs Yesterday"
//     : `Hourly Entry Traffic ${activeDate} vs Previous Day`;

//   const todayLegendLabel = isToday ? "Today" : "Selected Date";
//   const yesterdayLegendLabel = isToday ? "Yesterday" : "Previous Day";

//   return (
//     <div className="dash-page">
//       <div className="dash-noise" />
//       <div className="dash-topbar">
//         <div>
//           <div className="dash-title-wrap">
//             <span className="dash-title-icon"><Activity size={22} /></span>
//             <h1 className="dash-title">Dashboard</h1>
//           </div>
//           <p className="dash-sub">
//             <span className="dash-sub__store-tag">{activeStore}</span>
//             Viewing <strong style={{ color: '#8498b4' }}>{activeDate}</strong>
//             {isToday && <span className="dash-sub-live"><span className="live-dot" />Live</span>}
//             <span className="dash-sub__sep" />
//             Updated: {lastUpdated ?? '--'}
//             {loading && <span className="spinner" />}
//           </p>
//         </div>
//         <div className="dash-controls">
//           {(isAdmin || stores.length > 1) && (
//             <div className="store-wrap">
//               <Store size={13} className="store-wrap__icon" />
//               <select
//                 className="store-select"
//                 value={activeStore}
//                 onChange={(e) => setActiveStore(e.target.value)}
//               >
//                 {stores.map((s) => (
//                   <option key={s.id} value={s.store_name}>{s.store_name}</option>
//                 ))}
//               </select>
//             </div>
//           )}
//           <div className="date-wrap">
//             <Calendar size={13} className="date-wrap__icon" />
//             <input
//               type="date"
//               className="date-input"
//               value={activeDate}
//               max={todayStr}
//               onChange={(e) => e.target.value && setActiveDate(e.target.value)}
//             />
//           </div>
//           <button className="btn-refresh" onClick={() => fetchData()}>
//             <RefreshCw size={13} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="dash-kpi-grid">
//         <StatCard icon={Users} label="Total Footfall" value={data.footfall.toLocaleString()} colorClass="ci" />
//         <StatCard icon={Clock} label="Opening Time" value={data.openingTime} colorClass="ce" />
//         <StatCard icon={Clock} label="Closing Time" value={data.closingTime} colorClass="cr" />
//         <StatCard icon={Calendar} label="Busiest Day" value={data.busiestDay} colorClass="cv" />
//         <StatCard icon={Zap} label="Busiest Hour" value={data.busiestHour} colorClass="ca" />
//         <StatCard icon={Users} label="Male Peak" value={data.malePeak} colorClass="cc" />
//         <StatCard icon={Users} label="Female Peak" value={data.femalePeak} colorClass="cp" />
//       </div>

//       <div className="dash-flow-row">
//         <GenderCombinedCard maleCount={totalMale} femaleCount={totalFemale} />
//         <div className="gauge-card">
//           <p className="gauge-card__label">Gender Distribution</p>
//           <div className="gauge-card__row">
//             <GaugeChart percent={data.malePercent} color="#7b61ff" label="Male" />
//             <div className="gauge-card__divider" />
//             <GaugeChart percent={data.femalePercent} color="#ff6b9d" label="Female" />
//           </div>
//         </div>
//         <div className="info-card">
//           <div className="info-card__row">
//             <div className="info-card__item info-card__item--weekday">
//               <div className="info-card__icon"><Sun size={16} /></div>
//               <div>
//                 <p className="info-card__label">Weekday Visits</p>
//                 <h3 className="info-card__value">{weekday.toLocaleString()}</h3>
//               </div>
//             </div>
//             <div className="info-card__sep" />
//             <div className="info-card__item info-card__item--weekend">
//               <div className="info-card__icon info-card__icon--weekend"><Moon size={16} /></div>
//               <div>
//                 <p className="info-card__label">Weekend Visits</p>
//                 <h3 className="info-card__value info-card__value--weekend">{weekend.toLocaleString()}</h3>
//               </div>
//             </div>
//           </div>
//           <div className="info-card__bottom">
//             <BarChart2 size={13} style={{ color: '#475569' }} />
//             <span className="info-card__age-label">Top Age Group:</span>
//             <span className="info-card__age-value">{data.mostVisitedAgeGroup}</span>
//           </div>
//         </div>
//       </div>

//       <div className="dash-charts">
//         <div className="chart-card chart-card--full">
//           <div className="chart-card__head">
//             <h3 className="chart-card__title">{chartTitle}</h3>
//             <div style={{ display: 'flex', gap: 6 }}>
//               <span className="badge badge--teal">{isToday ? 'Today' : activeDate}: {data.entryCount}</span>
//               <span className="badge badge--slate">{isToday ? 'Yesterday' : 'Previous'}</span>
//             </div>
//           </div>
//           <div className="legend-row">
//             <span className="legend-item"><span className="legend-dot" style={{ background: '#00d4ff' }} />{todayLegendLabel}</span>
//             <span className="legend-item"><span className="legend-dot" style={{ background: '#475569', opacity: 0.8 }} />{yesterdayLegendLabel}</span>
//           </div>
//           <ResponsiveContainer width="100%" height={260}>
//             <ComposedChart data={combinedHourly} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
//               <defs>
//                 <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
//                   <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.045)" />
//               <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
//               <Tooltip content={<ChartTooltip />} cursor={false} />
//               <Area type="monotone" dataKey="today" name={todayLegendLabel} fill="url(#todayGrad)" stroke="#00d4ff" strokeWidth={2.5} dot={false} activeDot={false} />
//               <Line type="monotone" dataKey="yesterday" name={yesterdayLegendLabel} stroke="#475569" strokeWidth={1.8} strokeDasharray="4 3" dot={false} activeDot={false} />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-card">
//           <div className="chart-card__head">
//             <h3 className="chart-card__title">Age Groups</h3>
//             <span className="badge badge--teal">Distribution</span>
//           </div>
//           <div className="legend-row">
//             {ageData.map((d, i) => (
//               <span key={i} className="legend-item">
//                 <span className="legend-dot" style={{ background: AGE_COLORS[i % 4] }} />
//                 {d.name}
//               </span>
//             ))}
//           </div>
//           <ResponsiveContainer width="100%" height={240}>
//             <BarChart data={ageData} barSize={38}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.045)" />
//               <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
//               <Tooltip content={<ChartTooltip />} cursor={false} />
//               <Bar dataKey="value" radius={[7, 7, 0, 0]} isAnimationActive={false}>
//                 {ageData.map((_, i) => <Cell key={i} fill={AGE_COLORS[i % 4]} />)}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="chart-card">
//           <div className="chart-card__head">
//             <h3 className="chart-card__title">Gender vs Age</h3>
//             <div style={{ display: 'flex', gap: 6 }}>
//               <span className="badge badge--indigo">M: {genderAgeData.reduce((s, d) => s + d.male, 0)}</span>
//               <span className="badge badge--pink">F: {genderAgeData.reduce((s, d) => s + d.female, 0)}</span>
//             </div>
//           </div>
//           <div className="legend-row">
//             <span className="legend-item"><span className="legend-dot" style={{ background: '#7b61ff' }} />Male</span>
//             <span className="legend-item"><span className="legend-dot" style={{ background: '#ff6b9d' }} />Female</span>
//           </div>
//           <ResponsiveContainer width="100%" height={240}>
//             <BarChart data={genderAgeData} barGap={4} barSize={22}>
//               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.045)" />
//               <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
//               <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
//               <Tooltip content={<ChartTooltip />} cursor={false} />
//               <Bar dataKey="male" fill="#7b61ff" radius={[5, 5, 0, 0]} name="Male" />
//               <Bar dataKey="female" fill="#ff6b9d" radius={[5, 5, 0, 0]} name="Female" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {last7.length > 0 && (
//           <div className="chart-card chart-card--full">
//             <div className="chart-card__head">
//               <h3 className="chart-card__title">Last 7 Days Overview</h3>
//               <span className="badge badge--violet">Weekly Trend</span>
//             </div>
//             <div className="legend-row">
//               <span className="legend-item"><span className="legend-dot" style={{ background: '#7b61ff' }} />Male</span>
//               <span className="legend-item"><span className="legend-dot" style={{ background: '#ff6b9d' }} />Female</span>
//             </div>
//             <div className="last7-table">
//               <div className="last7-header">
//                 <span>Date</span>
//                 <span>Total</span>
//                 <span>Male</span>
//                 <span>Female</span>
//                 <span>Peak</span>
//                 <span>Opened Time</span>
//                 <span>Closed Time</span>
//               </div>
//               {last7.map((d, i) => (
//                 <div key={i} className="last7-row">
//                   <span className="last7-date">{d.date}</span>
//                   <span className="last7-total">{d.total.toLocaleString()}</span>
//                   <span className="last7-male">{d.male.toLocaleString()}</span>
//                   <span className="last7-female">{d.female.toLocaleString()}</span>
//                   <span className="last7-peak">{d.peakHour}{d.peakCount ? ` (${d.peakCount} people)` : ''}</span>
//                   <span className="last7-total">{d.openingTime}</span>
//                   <span className="last7-male">{d.closingTime}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from 'react';
import {
  Users, Clock, RefreshCw,
  Calendar, Zap, Activity, Sun, Moon, Store,
  ShoppingCart, ShieldAlert, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
  Line, ComposedChart, Area,
} from 'recharts';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL;

const DEFAULT = {
  footfall: 0, openingTime: 'N/A', closingTime: 'N/A',
  busiestDay: '--', busiestHour: '--',
  malePercent: 0, femalePercent: 0, malePeak: '--', femalePeak: '--',
  ageGroups: {}, genderAge: {}, entryCount: 0,
  hourlyTraffic: {}, yesterdayHourlyTraffic: {},
  mostVisitedAgeGroup: '--',
  weekdayVsWeekend: { weekday: 0, weekend: 0 },
  last7Days: [],
};

const AGE_COLORS = ['#00d4ff', '#7b61ff', '#ff6b9d', '#ffb347'];

/*                                                         */
/*  Alert mapper                                          */
/*                                                         */
const mapAlertRecords = (records = []) =>
  records.map((r, i) => {
    const rawDuration = r.durationMinutes ?? r.absentDurationAlert ?? 'N/A';
    const numericMins = parseFloat(rawDuration.toString().replace(/[^0-9.]/g, ''));
    return {
      id: i,
      counter: r.cameraId ?? r.counter ?? `#${i + 1}`,
      zone: r.zone ?? '',
      status: 'absent',
      lastSeen: r.triggeredTime ?? r.lastSeen ?? 'N/A',
      absentDurationAlert: isNaN(numericMins) ? 'N/A' : String(numericMins),
      alertType: r.alertType ?? '',
      resolvedTime: r.resolvedTime ?? 'N/A',
      isOngoing: r.isOngoing ?? false,
      roleType: r.roleType ?? '',
    };
  });

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      <p className="dash-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.stroke || p.fill || p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, colorClass, sub, extra }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-card__glow" />
    <div className="stat-card__icon"><Icon size={15} /></div>
    <div className="stat-card__body">
      <p className="stat-card__label">{label}</p>
      <h2 className="stat-card__value">{value}</h2>
      {sub && <p className="stat-card__sub">{sub}</p>}
      {extra && <div className="stat-card__extra stat-card__value">{extra}</div>}
    </div>
  </div>
);

/*                                                         */
/*  WeekdayWeekendCard  KPI-style, placed at column 4   */
/*                                                         */
const WeekdayWeekendCard = ({ weekday, weekend, topAgeGroup }) => (
  <div
    className="stat-card ca kpi-card--weekday"
    style={{ gridColumnStart: 4 }}
  >
    <div className="stat-card__glow" />
    <div className="stat-card__icon"><Sun size={15} /></div>
    <div className="stat-card__body">
      <p className="stat-card__label">Weekday vs Weekend</p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-data)',
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FFC85C' }}>
          <Sun size={11} /> {weekday.toLocaleString()}
        </span>
        <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)' }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FFA0A5' }}>
          <Moon size={11} /> {weekend.toLocaleString()}
        </span>
      </div>
      {topAgeGroup && topAgeGroup !== '--' && (
        <p className="stat-card__sub" style={{ marginTop: 6 }}>
          Top age:{' '}
          <span style={{ color: 'var(--teal)', fontWeight: 600 }}>
            {topAgeGroup}
          </span>
        </p>
      )}
    </div>
  </div>
);

/*                                                         */
/*  AlertCard  clickable; scrolls to its alerts block    */
/*                                                         */
const AlertCard = ({ icon: Icon, label, count, colorClass, onClick }) => {
  const isClickable = typeof onClick === 'function';
  return (
    <div
      className={`stat-card ${colorClass} ${isClickable ? 'stat-card--clickable' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={isClickable ? 'View alert details' : undefined}
    >
      <div className="stat-card__glow" />
      <div className="stat-card__icon"><Icon size={15} /></div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <h2 className="stat-card__value">{count}</h2>
        <p className="stat-card__sub">
          {count === 0
            ? <span style={{ color: 'var(--emerald)', fontSize: 10 }}> All clear</span>
            : <span style={{ color: '#FFA0A5', fontSize: 10 }}>� Active alerts</span>}
        </p>
      </div>
    </div>
  );
};

const sortHours = (entries) =>
  entries
    .map(([hour, counts]) => ({
      hour,
      ...(typeof counts === 'object' ? counts : { entry: counts, exit: 0 }),
      _sort: (() => {
        const parts = (hour || '').trim().split(' ');
        if (parts.length < 2) return 0;
        const [h, period] = parts;
        let n = parseInt(h, 10);
        if (period === 'PM' && n !== 12) n += 12;
        if (period === 'AM' && n === 12) n = 0;
        return n;
      })(),
    }))
    .sort((a, b) => a._sort - b._sort);

/*                                                         */
/*  Alerts monitoring section (cashier + security)        */
/*                                                         */
const AlertsSection = ({ cashierAlerts, securityAlerts, sectionRef, cashierRef, securityRef }) => {
  const threshold = (type) => (type === 'cashier' ? 30 : 45);

  const AbsentTimer = ({ mins }) => {
    if (!mins || isNaN(mins)) return <span style={{ opacity: 0.35 }}></span>;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return <span className="absent-timer">{h > 0 ? `${h}h ${m}m` : `${Math.round(mins)}m`}</span>;
  };

  const MonitorTable = ({ rows, type }) => (
    <div className="monitor-table-wrap">
      <table className="monitor-table">
        <thead>
          <tr>
            <th>Camera</th>
            <th>Zone</th>
            <th>Triggered At</th>
            <th>Duration</th>
            <th>Resolved At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', opacity: 0.45, padding: '18px 0', fontSize: 12 }}>
                No alerts recorded
              </td>
            </tr>
          ) : (
            rows.map((r, i) => {
              const mins = parseFloat(r.absentDurationAlert);
              const isHigh = !isNaN(mins) && mins >= threshold(type);
              return (
                <tr key={i} className={isHigh ? 'row--alert' : ''}>
                  <td className="col-name">{r.counter}</td>
                  <td><span className="zone-chip">{r.zone}</span></td>
                  <td className="col-time">{r.lastSeen}</td>
                  <td><AbsentTimer mins={mins} /></td>
                  <td className="col-time">
                    {r.isOngoing
                      ? <span className="ongoing-badge"><span className="ongoing-dot" />Ongoing</span>
                      : r.resolvedTime && r.resolvedTime !== 'N/A' ? r.resolvedTime : ''}
                  </td>
                  <td>
                    {isHigh
                      ? <span className="alert-badge"><AlertTriangle size={10} /> High</span>
                      : <span className="ok-badge">OK</span>}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div ref={sectionRef} className="alerts-section">
      <div ref={cashierRef} className="alerts-section__block">
        <div className="alerts-section__head">
         
          <span className='chart-card__title'>Cashier Monitoring</span>
          {cashierAlerts.length > 0 && (
            <span className="alert-chip">
              <AlertTriangle size={10} /> {cashierAlerts.length} alert{cashierAlerts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <MonitorTable rows={cashierAlerts} type="cashier" />
      </div>

      <div ref={securityRef} className="alerts-section__block">
        <div className="alerts-section__head">
         
          <span className='chart-card__title'>Security Monitoring</span>
          {securityAlerts.length > 0 && (
            <span className="alert-chip">
              <AlertTriangle size={10} /> {securityAlerts.length} alert{securityAlerts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <MonitorTable rows={securityAlerts} type="security" />
      </div>
    </div>
  );
};

/*                                                         */
/*  Main Dashboard component                              */
/*                                                         */
export default function Dashboard() {
  const [data, setData] = useState(DEFAULT);
  const [cashierAlerts, setCashierAlerts] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLast] = useState(null);
  const [stores, setStores] = useState([]);
  const todayStr = new Date().toISOString().split('T')[0];
  const [activeDate, setActiveDate] = useState(todayStr);
  const [activeStore, setActiveStore] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  /* refs for scroll targets */
  const alertsSectionRef = useRef(null);
  const cashierBlockRef = useRef(null);
  const securityBlockRef = useRef(null);

  const scrollToRef = (ref) => {
    const target = ref?.current ?? alertsSectionRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getToken = () => localStorage.getItem('token');
  const getIsAdmin = () => {
    const stored = localStorage.getItem('is_admin');
    if (stored !== null) return stored === 'true';
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.is_admin === true;
    } catch {
      return false;
    }
  };

  const fetchStores = async () => {
    const token = getToken();
    if (!token) return;
    setIsAdmin(getIsAdmin());
    try {
      const res = await fetch(`${API_BASE}/api/stores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setStores(json);
        if (json.length > 0) {
          setActiveStore(prev => prev || json[0].store_name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch stores');
    }
  };

  const fetchData = async (storeOverride) => {
    const token = getToken();
    if (!token) {
      console.error("No token found - Please login");
      return;
    }

    const storeToFetch = storeOverride !== undefined ? storeOverride : activeStore;
    if (!storeToFetch) return;

    setLoading(true);
    try {
      const storeParam = encodeURIComponent(storeToFetch);
      const dashUrl = `${API_BASE}/api/dashboard_stats?date=${activeDate}&store=${storeParam}`;
      const analyticsUrl = `${API_BASE}/api/analytics?date=${activeDate}&store=${storeParam}`;

      const authHeaders = { Authorization: `Bearer ${token}` };

      /* Dashboard stats (required) + analytics (optional, for alerts) */
      const [dashRes, analyticsRes] = await Promise.all([
        fetch(dashUrl, { headers: authHeaders }),
        fetch(analyticsUrl, { headers: authHeaders }).catch(() => null),
      ]);

      if (dashRes.status === 401) {
        console.error("Unauthorized - Please login again");
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      let dashJson = {};
      if (dashRes.ok) {
        dashJson = await dashRes.json().catch(() => ({}));
        setData({ ...DEFAULT, ...(dashJson || {}) });
      }

      let analyticsJson = {};
      if (analyticsRes && analyticsRes.ok) {
        analyticsJson = await analyticsRes.json().catch(() => ({}));
      }

      const counterSrc =
        analyticsJson?.counterSummary ??
        dashJson?.counterSummary ??
        [];
      const securitySrc =
        analyticsJson?.securitySummary ??
        dashJson?.securitySummary ??
        [];

      setCashierAlerts(mapAlertRecords(counterSrc));
      setSecurityAlerts(mapAlertRecords(securitySrc));

      setLast(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchStores();
    }
  }, []);

  useEffect(() => {
    if (!activeStore) return;
    const token = getToken();
    if (!token) return;

    fetchData();
    let id;
    if (activeDate === todayStr) {
      id = setInterval(() => fetchData(), 5000);
    }
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate, activeStore]);

  /*    derived data    */
  const ageData = Object.entries(data.ageGroups || {}).map(([k, v]) => ({ name: k, value: v }));
  const genderAgeData = Object.entries(data.genderAge || {}).map(([k, v]) => ({
    name: k, male: v.male || 0, female: v.female || 0,
  }));

  const todaySorted = sortHours(Object.entries(data.hourlyTraffic || {}));
  const yesterdaySorted = sortHours(Object.entries(data.yesterdayHourlyTraffic || {}));

  const allHours = [...new Set([
    ...todaySorted.map((d) => d.hour),
    ...yesterdaySorted.map((d) => d.hour),
  ])].sort((a, b) => {
    const parse = (h) => {
      const parts = (h || '').trim().split(' ');
      if (parts.length < 2) return 0;
      let n = parseInt(parts[0], 10);
      if (parts[1] === 'PM' && n !== 12) n += 12;
      if (parts[1] === 'AM' && n === 12) n = 0;
      return n;
    };
    return parse(a) - parse(b);
  });

  const todayMap = Object.fromEntries(todaySorted.map((d) => [d.hour, d.entry ?? 0]));
  const yesterdayMap = Object.fromEntries(yesterdaySorted.map((d) => [d.hour, d.entry ?? 0]));
  const combinedHourly = allHours.map((hour) => ({
    hour,
    today: todayMap[hour] ?? 0,
    yesterday: yesterdayMap[hour] ?? 0,
  }));

  const { weekday = 0, weekend = 0 } = data.weekdayVsWeekend || {};
  const last7 = data.last7Days || [];

  const isToday = activeDate === todayStr;
  const chartTitle = isToday
    ? 'Hourly Entry Traffic Today vs Yesterday'
    : `Hourly Entry Traffic ${activeDate} vs Previous Day`;
  const todayLegendLabel = isToday ? 'Today' : 'Selected Date';
  const yesterdayLegendLabel = isToday ? 'Yesterday' : 'Previous Day';

  /* gender % for footfall card */
  const maleP = data.malePercent || 0;
  const femaleP = data.femalePercent || 0;

  const genderExtra = (
    <div className="gender-pct-row">
      <span className="gender-pct gender-pct--male">M {maleP}% , </span>
      <span className="gender-pct gender-pct--female">F {femaleP}%</span>
    </div>
  );

  return (
    <div className="dash-page">
      <div className="dash-noise" />

      {/*    Top bar    */}
      <div className="dash-topbar">
        <div>
          <div className="dash-title-wrap">
            <span className="dash-title-icon"><Activity size={22} /></span>
            <h1 className="dash-title">Dashboard</h1>
          </div>
          <p className="dash-sub">
            {activeStore && <span className="dash-sub__store-tag">{activeStore}</span>}
            Viewing <strong style={{ color: '#8498b4' }}>{activeDate}</strong>
            {isToday && <span className="dash-sub-live"><span className="live-dot" />Live</span>}
            <span className="dash-sub__sep" />
            Updated: {lastUpdated ?? '--'}
            {loading && <span className="spinner" />}
          </p>
        </div>
        <div className="dash-controls">
          {(isAdmin || stores.length > 1) && (
            <div className="store-wrap">
              <Store size={13} className="store-wrap__icon" />
              <select
                className="store-select"
                value={activeStore}
                onChange={(e) => setActiveStore(e.target.value)}
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.store_name}>{s.store_name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="date-wrap">
            <Calendar size={13} className="date-wrap__icon" />
            <input
              type="date"
              className="date-input"
              value={activeDate}
              max={todayStr}
              onChange={(e) => e.target.value && setActiveDate(e.target.value)}
            />
          </div>
          <button className="btn-refresh" onClick={() => fetchData()}>
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/*    KPI grid (2 rows)    */}
      <div className="dash-kpi-grid">
        {/* Row 1 */}
        <StatCard
          icon={Users}
          label="Today's Footfall"
          value={data.footfall.toLocaleString()}
          colorClass="ce"
          extra={genderExtra}
        />
        <StatCard icon={Clock} label="Opening Time" value={data.openingTime} colorClass="ce" />
        <StatCard icon={Clock} label="Closing Time" value={data.closingTime} colorClass="cr" />
        <StatCard icon={Calendar} label="Busiest Day" value={data.busiestDay} colorClass="cv" />
        <StatCard icon={Zap} label="Busiest Hour" value={data.busiestHour} colorClass="ca" />
        <AlertCard
          icon={ShoppingCart}
          label="Cashier Alerts"
          count={cashierAlerts.length}
          colorClass={cashierAlerts.length > 0 ? 'cp' : 'ce'}
          onClick={() => scrollToRef(cashierBlockRef)}
        />
        <AlertCard
          icon={ShieldAlert}
          label="Security Alerts"
          count={securityAlerts.length}
          colorClass={securityAlerts.length > 0 ? 'cp' : 'ce'}
          onClick={() => scrollToRef(securityBlockRef)}
        />

        {/* Row 2  placed under "Busiest Day" (col 4) */}
        <WeekdayWeekendCard
          weekday={weekday}
          weekend={weekend}
          topAgeGroup={data.mostVisitedAgeGroup}
        />
      </div>

      {/*    Charts    */}
      <div className="dash-charts">
        <div className="chart-card chart-card--full">
          <div className="chart-card__head">
            <h3 className="chart-card__title">{chartTitle}</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge--teal">{isToday ? 'Today' : activeDate}: {data.entryCount}</span>
              <span className="badge badge--slate">{isToday ? 'Yesterday' : 'Previous'}</span>
            </div>
          </div>
          <div className="legend-row">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#00d4ff' }} />{todayLegendLabel}</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#475569', opacity: 0.8 }} />{yesterdayLegendLabel}</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={combinedHourly} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.045)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={false} />
              <Area type="monotone" dataKey="today" name={todayLegendLabel} fill="url(#todayGrad)" stroke="#00d4ff" strokeWidth={2.5} dot={false} activeDot={false} />
              <Line type="monotone" dataKey="yesterday" name={yesterdayLegendLabel} stroke="#475569" strokeWidth={1.8} strokeDasharray="4 3" dot={false} activeDot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card__head">
            <h3 className="chart-card__title">Age Groups</h3>
            <span className="badge badge--teal">Distribution</span>
          </div>
          <div className="legend-row">
            {ageData.map((d, i) => (
              <span key={i} className="legend-item">
                <span className="legend-dot" style={{ background: AGE_COLORS[i % 4] }} />
                {d.name}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ageData} barSize={38}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.045)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={false} />
              <Bar dataKey="value" radius={[7, 7, 0, 0]} isAnimationActive={false}>
                {ageData.map((_, i) => <Cell key={i} fill={AGE_COLORS[i % 4]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card__head">
            <h3 className="chart-card__title">Gender vs Age</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge--indigo">M: {genderAgeData.reduce((s, d) => s + d.male, 0)}</span>
              <span className="badge badge--pink">F: {genderAgeData.reduce((s, d) => s + d.female, 0)}</span>
            </div>
          </div>
          <div className="legend-row">
            <span className="legend-item"><span className="legend-dot" style={{ background: '#7b61ff' }} />Male</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#ff6b9d' }} />Female</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={genderAgeData} barGap={4} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.045)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={false} />
              <Bar dataKey="male" fill="#7b61ff" radius={[5, 5, 0, 0]} name="Male" />
              <Bar dataKey="female" fill="#ff6b9d" radius={[5, 5, 0, 0]} name="Female" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {last7.length > 0 && (
          <div className="chart-card chart-card--full">
            <div className="chart-card__head">
              <h3 className="chart-card__title">Last 7 Days Overview</h3>
              <span className="badge badge--violet">Weekly Trend</span>
            </div>
            <div className="legend-row">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#7b61ff' }} />Male</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#ff6b9d' }} />Female</span>
            </div>
            <div className="last7-table">
              <div className="last7-header">
                <span>Date</span>
                <span>Total</span>
                <span>Male</span>
                <span>Female</span>
                <span>Peak</span>
                <span>Opened Time</span>
                <span>Closed Time</span>
              </div>
              {last7.map((d, i) => (
                <div key={i} className="last7-row">
                  <span className="last7-date">{d.date}</span>
                  <span className="last7-total">{d.total.toLocaleString()}</span>
                  <span className="last7-male">{d.male.toLocaleString()}</span>
                  <span className="last7-female">{d.female.toLocaleString()}</span>
                  <span className="last7-peak">{d.peakHour}{d.peakCount ? ` (${d.peakCount} people)` : ''}</span>
                  <span className="last7-total">{d.openingTime}</span>
                  <span className="last7-male">{d.closingTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/*    Alerts section (scroll target)    */}
      <AlertsSection
        cashierAlerts={cashierAlerts}
        securityAlerts={securityAlerts}
        sectionRef={alertsSectionRef}
        cashierRef={cashierBlockRef}
        securityRef={securityBlockRef}
      />
    </div>
  );
}