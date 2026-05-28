// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
// //   CartesianGrid, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line,
// // } from 'recharts';
// // import {
// //   Calendar, RefreshCw, Users, TrendingUp,
// //   AlertTriangle, CheckCircle, ShieldAlert, ShoppingCart, Flame, Store,
// // } from 'lucide-react';
// // import './Analytics.css';

// // const API_BASE = import.meta.env.VITE_API_URL;
// // const ZONE_COLORS = ['#00C896','#7C6AF7','#F5A623','#F06068','#22D3EE','#A78BFA','#34D399'];
// // const WEEKDAY_COLOR = '#7C6AF7';
// // const WEEKEND_COLOR = '#00C896';
// // const todayStr = new Date().toISOString().split('T')[0];
// // const TICK_STYLE = { fill: '#2D3A4D', fontSize: 10, fontFamily: 'DM Mono, monospace' };
// // const GRID_STROKE = 'rgba(255,255,255,0.2)';
// // const CHART_MARGIN_FULL = { top: 6, right: 0, bottom: 0, left: -10 };
// // const XAXIS_PAD = { left: 0, right: 0 };
// // const YAXIS_DOMAIN = [0, dataMax => Math.ceil(dataMax * 1.12) || 10];

// // const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
// //   if (percent < 0.05) return null;
// //   const RAD = Math.PI / 180;
// //   const r = innerRadius + (outerRadius - innerRadius) * 0.58;
// //   const x = cx + r * Math.cos(-midAngle * RAD);
// //   const y = cy + r * Math.sin(-midAngle * RAD);
// //   return (
// //     <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#fff" style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 600, pointerEvents: 'none' }}>
// //       {`${(percent * 100).toFixed(1)}%`}
// //     </text>
// //   );
// // };

// // const ChartTooltip = ({ active, payload, label }) => {
// //   if (!active || !payload?.length) return null;
// //   return (
// //     <div className="an-tooltip">
// //       <p className="an-tooltip__label">{label}</p>
// //       {payload.map((p, i) => (
// //         <p key={i} style={{ color: p.fill || p.stroke || p.color, marginTop: 3 }}>
// //           {p.name}: <strong>{p.value?.toLocaleString()}</strong>
// //         </p>
// //       ))}
// //     </div>
// //   );
// // };

// // const PieTooltip = ({ active, payload }) => {
// //   if (!active || !payload?.length) return null;
// //   const d = payload[0];
// //   return (
// //     <div className="an-tooltip">
// //       <p className="an-tooltip__label">{d.name}</p>
// //       <p style={{ color: d.payload.fill, marginTop: 3 }}>
// //         Visitors: <strong>{d.value?.toLocaleString()}</strong>
// //       </p>
// //       <p style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>
// //         {((d.value / d.payload.total) * 100).toFixed(1)}%
// //       </p>
// //     </div>
// //   );
// // };

// // const StatusBadge = ({ status }) => {
// //   const ok = status?.toLowerCase() === 'present';
// //   return ok
// //     ? <span className="status-badge status-badge--present"><CheckCircle size={10} /> Present</span>
// //     : <span className="status-badge status-badge--absent"><AlertTriangle size={10} /> Absent</span>;
// // };

// // const AbsentTimer = ({ durationStr }) => {
// //   if (!durationStr || durationStr === 'N/A') return <span className="absent-zero"></span>;
// //   const cleaned = durationStr.toString().replace(/[^0-9.]/g, '');
// //   const mins = parseFloat(cleaned);
// //   if (isNaN(mins) || mins === 0) return <span className="absent-zero">0m</span>;
// //   const h = Math.floor(mins / 60);
// //   const m = Math.round(mins % 60);
// //   const label = h > 0 ? `${h}h ${m}m` : `${Math.round(mins)}m`;
// //   return <span className="absent-timer">{label}</span>;
// // };

// // const ResolvedCell = ({ resolvedTime, isOngoing }) => {
// //   if (isOngoing) {
// //     return (
// //       <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#F06068', fontFamily: 'var(--font-data)', fontWeight: 600 }}>
// //         <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F06068', animation: 'pulse 1.4s ease-in-out infinite', display: 'inline-block', flexShrink: 0 }} />
// //         Ongoing
// //       </span>
// //     );
// //   }
// //   if (!resolvedTime || resolvedTime === 'N/A' || resolvedTime === 'Ongoing') {
// //     return <span style={{ opacity: 0.35, fontSize: 11 }}></span>;
// //   }
// //   return (
// //     <span className="col-time">
// //       <CheckCircle size={11} style={{ marginRight: 4, opacity: 0.5, color: '#00C896' }} />
// //       {resolvedTime}
// //     </span>
// //   );
// // };

// // function parseHour(h) {
// //   if (!h || typeof h !== 'string') return 0;
// //   const parts = h.trim().split(' ');
// //   let n = parseInt(parts[0], 10);
// //   const period = parts[1]?.toUpperCase();
// //   if (period === 'PM' && n !== 12) n += 12;
// //   if (period === 'AM' && n === 12) n = 0;
// //   return n;
// // }

// // const mapAlertRecord = (r, i) => {
// //   const rawDuration = r.durationMinutes ?? r.absentDurationAlert ?? 'N/A';
// //   const numericMins = parseFloat(rawDuration.toString().replace(/[^0-9.]/g, ''));
// //   return {
// //     id: i,
// //     counter: r.cameraId ?? r.counter ?? `#${i + 1}`,
// //     zone: r.zone ?? '',
// //     status: 'absent',
// //     lastSeen: r.triggeredTime ?? r.lastSeen ?? 'N/A',
// //     absentDurationAlert: isNaN(numericMins) ? 'N/A' : String(numericMins),
// //     alertType: r.alertType ?? '',
// //     resolvedTime: r.resolvedTime ?? 'N/A',
// //     isOngoing: r.isOngoing ?? false,
// //     roleType: (r.roleType ?? '').toString().toLowerCase().trim(),
// //   };
// // };

// // function transformApiData(json) {
// //   const {
// //     zoneFootfall, hourlyByZone, weekdayVsWeekendByZone,
// //     mostVisitedZone, busiestDayThisWeek, totalVisitorsToday,
// //     counterSummary, securitySummary,
// //   } = json;

// //   const total = Object.values(zoneFootfall || {}).reduce((s, v) => s + v, 0);
// //   const zoneVisits = Object.entries(zoneFootfall || {}).map(([zone, count], i) => ({
// //     zone, total: count, fill: ZONE_COLORS[i % ZONE_COLORS.length], totalSum: total,
// //   }));

// //   const zones = [...new Set(Object.keys(hourlyByZone || {}))];
// //   const hourlyMap = {};
// //   Object.entries(hourlyByZone || {}).forEach(([zone, hours]) => {
// //     Object.entries(hours).forEach(([hour, counts]) => {
// //       if (!hourlyMap[hour]) hourlyMap[hour] = { hour };
// //       hourlyMap[hour][zone] = (counts.entry || 0) + (counts.exit || 0);
// //     });
// //   });
// //   const hourlyData = Object.values(hourlyMap)
// //     .sort((a, b) => parseHour(a.hour) - parseHour(b.hour))
// //     .map(row => {
// //       const filled = { ...row };
// //       zones.forEach(z => { if (filled[z] == null) filled[z] = 0; });
// //       filled.total = zones.reduce((s, z) => s + (filled[z] || 0), 0);
// //       return filled;
// //     });

// //   const weekdayData = Object.entries(weekdayVsWeekendByZone || {}).map(([zone, val]) => ({
// //     zone, weekday: val.weekday || 0, weekend: val.weekend || 0,
// //   }));

// //   const wdTotals = weekdayData.reduce(
// //     (acc, z) => { acc[0].value += z.weekday; acc[1].value += z.weekend; return acc; },
// //     [{ name: 'Weekday', value: 0, fill: WEEKDAY_COLOR }, { name: 'Weekend', value: 0, fill: WEEKEND_COLOR }]
// //   );
// //   const wdGrandTotal = wdTotals.reduce((s, d) => s + d.value, 0);
// //   const wdPieData = wdTotals.map(d => ({ ...d, total: wdGrandTotal, value: d.value === 0 ? 0.00 : d.value }));

// //   const peakZone = mostVisitedZone || { zone: 'N/A', count: 0, date: '' };
// //   const busiestDay = busiestDayThisWeek || { day: 'N/A', count: 0, date: '' };

// //   const cashiers = (counterSummary || []).map(mapAlertRecord);
// //   const security = (securitySummary || []).map(mapAlertRecord);

// //   return {
// //     zoneVisits, hourlyData, weekdayData, wdPieData, wdGrandTotal,
// //     peakZone, busiestDay, cashiers, security, zones, total,
// //     totalVisitorsToday: totalVisitorsToday || 0,
// //   };
// // }

// // const MonitorTable = ({ rows, type }) => {
// //   const threshold = type === 'cashier' ? 30 : 45;
// //   return (
// //     <div className="monitor-table-wrap">
// //       <table className="monitor-table" style={{ tableLayout: 'fixed', width: '100%' }}>
// //         <colgroup>
// //           <col style={{ width: '14.28%' }} />
// //           <col style={{ width: '14.28%' }} />
// //           <col style={{ width: '14.28%' }} />
// //           <col style={{ width: '14.28%' }} />
// //           <col style={{ width: '14.28%' }} />
// //           <col style={{ width: '14.28%' }} />
// //           <col style={{ width: '14.32%' }} />
// //         </colgroup>
// //         <thead>
// //           <tr>
// //             <th>Camera</th>
// //             <th>Zone</th>
// //             <th>Status</th>
// //             <th>Triggered At</th>
// //             <th>Duration</th>
// //             <th>Resolved At</th>
// //             <th>Alert</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {rows.length === 0 ? (
// //             <tr>
// //               <td colSpan={7} style={{ textAlign: 'center', opacity: 0.45, padding: '18px 0', fontSize: 12 }}>
// //                 No alerts recorded
// //               </td>
// //             </tr>
// //           ) : (
// //             rows.map((r, idx) => {
// //               const mins = parseFloat(r.absentDurationAlert);
// //               const isAlert = r.status === 'absent' && !isNaN(mins) && mins >= threshold;
// //               return (
// //                 <tr key={`${r.counter}-${r.zone}-${idx}`}>
// //                   <td className="col-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.counter}</td>
// //                   <td><span className="zone-chip">{r.zone}</span></td>
// //                   <td><StatusBadge status={r.status} /></td>
// //                   <td className="col-time" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.lastSeen}</td>
// //                   <td><AbsentTimer durationStr={r.absentDurationAlert} /></td>
// //                   <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
// //                     <ResolvedCell resolvedTime={r.resolvedTime} isOngoing={r.isOngoing} />
// //                   </td>
// //                   <td>
// //                     {isAlert
// //                       ? <span className="alert-chip"><AlertTriangle size={11} /></span>
// //                       : <span className="ok-icon"><CheckCircle size={13} /></span>}
// //                   </td>
// //                 </tr>
// //               );
// //             })
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // const getToken = () => localStorage.getItem('token');
// // const getIsAdmin = () => {
// //   const stored = localStorage.getItem('is_admin');
// //   if (stored !== null) return stored === 'true';
// //   const token = localStorage.getItem('token');
// //   if (!token) return false;
// //   try {
// //     const payload = JSON.parse(atob(token.split('.')[1]));
// //     return payload.is_admin === true;
// //   } catch {
// //     return false;
// //   }
// // };

// // export default function Analytics() {
// //   const [activeDate, setActiveDate] = useState(todayStr);
// //   const [loading, setLoading] = useState(false);
// //   const [data, setData] = useState(null);
// //   const [lastUpdated, setLast] = useState(null);
// //   const [stores, setStores] = useState([]);
// //   const [activeStore, setActiveStore] = useState('');
// //   const [isAdmin, setIsAdmin] = useState(false);

// //   const fetchStores = useCallback(async () => {
// //     const token = getToken();
// //     if (!token) return;
// //     setIsAdmin(getIsAdmin());
// //     try {
// //       const res = await fetch(`${API_BASE}/api/stores`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (res.ok) {
// //         const json = await res.json();
// //         setStores(json);
// //         if (json.length > 0) setActiveStore(prev => prev || json[0].store_name);
// //       }
// //     } catch (e) {
// //       console.error('Failed to fetch stores', e);
// //     }
// //   }, []);

// //   const fetchData = useCallback(async (silent = false) => {
// //     const token = getToken();
// //     if (!token || !activeStore) return;
// //     if (!silent) setLoading(true);
// //     try {
// //       const url = `${API_BASE}/api/analytics?date=${activeDate}&store=${encodeURIComponent(activeStore)}`;
// //       const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
// //       if (res.status === 401) {
// //         localStorage.removeItem('token');
// //         window.location.href = '/login';
// //         return;
// //       }
// //       const json = await res.json();
// //       const newData = transformApiData(json);
// //       if (silent) {
// //         setData(prev => JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData);
// //       } else {
// //         setData(newData);
// //         setLast(new Date().toLocaleTimeString());
// //       }
// //     } catch (e) {
// //       console.error(e);
// //     }
// //     if (!silent) setLoading(false);
// //   }, [activeDate, activeStore]);

// //   useEffect(() => {
// //     const token = getToken();
// //     if (token) fetchStores();
// //   }, [fetchStores]);

// //   useEffect(() => {
// //     if (!activeStore) return;
// //     fetchData(false);
// //     let id;
// //     if (activeDate === todayStr) id = setInterval(() => fetchData(true), 5000);
// //     return () => clearInterval(id);
// //   }, [activeDate, activeStore]);

// //   const handleDateChange = (e) => { if (e.target.value) setActiveDate(e.target.value); };

// //   const formatDisplayDate = (str) => {
// //     if (!str) return '';
// //     const d = new Date(str + 'T00:00:00');
// //     return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
// //   };

// //   const isToday = activeDate === todayStr;

// //   if (!data) return (
// //     <div className="an-loading">
// //       <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
// //       <p>Loading analytics</p>
// //     </div>
// //   );

// //   const totalVisitors = data.zoneVisits.reduce((s, z) => s + z.total, 0);
// //   const absentCashiers = data.cashiers.length;
// //   const absentGuards = data.security.length;
// //   const pieData = data.zoneVisits.map(z => ({ ...z, value: z.total }));
// //   const visiblePieData = pieData.filter(d => d.value > 0);
// //   const visibleWdPieData = data.wdPieData.filter(d => d.value > 0);

// //   return (
// //     <div className="an-page">
// //       <div className="an-header">
// //         <div>
// //           <h1 className="an-title">Zone <span>Analytics</span></h1>
// //           <p className="an-sub">
// //             {activeStore && <span className="an-sub-store-tag">{activeStore}</span>}
// //             <span className="an-sub-date">{formatDisplayDate(activeDate)}</span>
// //             {isToday && <span className="an-sub-live"><span className="live-dot" />Live</span>}
// //             {lastUpdated && <><span className="an-sub-sep" /><span>Updated {lastUpdated}</span></>}
// //             {loading && <span className="spinner" style={{ marginLeft: 4 }} />}
// //           </p>
// //         </div>
// //         <div className="an-controls">
// //           {(isAdmin || stores.length > 1) && (
// //             <div className="store-wrap">
// //               <Store size={13} className="store-wrap__icon" />
// //               <select className="store-select" value={activeStore} onChange={e => setActiveStore(e.target.value)}>
// //                 {stores.map(s => <option key={s.id} value={s.store_name}>{s.store_name}</option>)}
// //               </select>
// //             </div>
// //           )}
// //           <div className="date-wrap">
// //             <Calendar size={13} className="date-wrap__icon" />
// //             <input type="date" className="date-input" value={activeDate} max={todayStr} onChange={handleDateChange} />
// //           </div>
// //           <button className="btn-refresh" onClick={() => fetchData(false)} disabled={loading}>
// //             <RefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none', display: 'block' }} />
// //             Refresh
// //           </button>
// //         </div>
// //       </div>

// //       <div className="an-kpi-row">
// //         <div className="an-kpi an-kpi--teal">
// //           <div className="an-kpi__icon"><Users size={17} /></div>
// //           <div>
// //             <p className="an-kpi__label">Total Visitors</p>
// //             <h3 className="an-kpi__val">{data.totalVisitorsToday.toLocaleString()}</h3>
// //           </div>
// //         </div>
// //         <div className="an-kpi an-kpi--amber">
// //           <div className="an-kpi__icon"><TrendingUp size={17} /></div>
// //           <div>
// //             <p className="an-kpi__label">Peak Zone</p>
// //             <h3 className="an-kpi__val an-kpi__val--sm">
// //               {data.peakZone.zone}
// //               {data.peakZone.count > 0 && <span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: 5, fontWeight: 400 }}>({data.peakZone.count.toLocaleString()})</span>}
// //             </h3>
// //           </div>
// //         </div>
// //         <div className="an-kpi an-kpi--violet">
// //           <div className="an-kpi__icon"><Flame size={17} /></div>
// //           <div>
// //             <p className="an-kpi__label">Busiest Day This Week</p>
// //             <h3 className="an-kpi__val an-kpi__val--sm">
// //               {data.busiestDay.day}
// //               {data.busiestDay.count > 0 && <span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: 5, fontWeight: 400 }}>({data.busiestDay.count.toLocaleString()})</span>}
// //             </h3>
// //           </div>
// //         </div>
// //         <div className={`an-kpi ${absentCashiers > 0 ? 'an-kpi--rose' : 'an-kpi--emerald'}`}>
// //           <div className="an-kpi__icon"><ShoppingCart size={17} /></div>
// //           <div>
// //             <p className="an-kpi__label">Cashier Alerts</p>
// //             <h3 className="an-kpi__val">{absentCashiers}</h3>
// //           </div>
// //         </div>
// //         <div className={`an-kpi ${absentGuards > 0 ? 'an-kpi--rose' : 'an-kpi--emerald'}`}>
// //           <div className="an-kpi__icon"><ShieldAlert size={17} /></div>
// //           <div>
// //             <p className="an-kpi__label">Security Alerts</p>
// //             <h3 className="an-kpi__val">{absentGuards}</h3>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="an-charts-grid">
// //         <div className="an-chart-card">
// //           <div className="an-chart-card__head">
// //             <h3 className="an-chart-card__title">Zone Distribution</h3>
// //             <span className="badge badge--teal">Footfall %</span>
// //           </div>
// //           <div className="pie-dist-layout">
// //             <ResponsiveContainer width="100%" height={260}>
// //               <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
// //                 <Pie data={visiblePieData} cx="50%" cy="50%" innerRadius="36%" outerRadius="78%" paddingAngle={visiblePieData.length > 1 ? 1 : 0} startAngle={90} endAngle={-270} dataKey="value" stroke="none" label={renderPieLabel} labelLine={false}>
// //                   {visiblePieData.map(entry => <Cell key={entry.zone} fill={entry.fill} />)}
// //                 </Pie>
// //                 <Tooltip content={<PieTooltip />} />
// //               </PieChart>
// //             </ResponsiveContainer>
// //             <div className="pie-legend" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
// //               {pieData.map(z => (
// //                 <div key={z.zone} className="pie-legend-item">
// //                   <span className="pie-legend-dot" style={{ background: z.fill }} />
// //                   <span className="pie-legend-label">{z.zone}:</span>
// //                   <span className="pie-legend-val">{z.total.toLocaleString()}</span>
// //                   <span className="pie-legend-pct">{totalVisitors > 0 ? ((z.total / totalVisitors) * 100).toFixed(1) : 0}%</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="an-chart-card">
// //           <div className="an-chart-card__head">
// //             <h3 className="an-chart-card__title">Weekday vs Weekend</h3>
// //             <div style={{ display: 'flex', gap: 5 }}>
// //               <span className="badge badge--violet">Weekday</span>
// //               <span className="badge badge--teal">Weekend</span>
// //             </div>
// //           </div>
// //           <div className="wd-split-layout">
// //             <ResponsiveContainer width="100%" height={240}>
// //               <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
// //                 <Pie data={visibleWdPieData} cx="50%" cy="50%" innerRadius="36%" outerRadius="82%" paddingAngle={visibleWdPieData.length > 1 ? 3 : 0} startAngle={90} endAngle={-270} dataKey="value" stroke="none" label={renderPieLabel} labelLine={false}>
// //                   {visibleWdPieData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
// //                 </Pie>
// //                 <Tooltip content={<PieTooltip />} />
// //               </PieChart>
// //             </ResponsiveContainer>
// //             <div className="wd-stat-col">
// //               {data.wdPieData.map(d => (
// //                 <div key={d.name} className="wd-stat-item">
// //                   <span className="wd-stat-label" style={{ color: d.fill }}>{d.name}</span>
// //                   <span className="wd-stat-val" style={{ color: d.fill }}>{d.value.toLocaleString()}</span>
// //                   <div className="wd-bar-track">
// //                     <div className="wd-bar-fill" style={{ background: d.fill, width: `${data.wdGrandTotal > 0 ? ((d.value / data.wdGrandTotal) * 100).toFixed(1) : 0}%` }} />
// //                   </div>
// //                   <span className="wd-pct">{data.wdGrandTotal > 0 ? ((d.value / data.wdGrandTotal) * 100).toFixed(1) : 0}% of total</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //           <div className="divider-line" />
// //           <p className="an-chart-card__title" style={{ marginBottom: 10 }}>By Zone</p>
// //           <ResponsiveContainer width="100%" height={150}>
// //             <BarChart data={data.weekdayData} barCategoryGap="28%" barGap={3} margin={{ top: 2, right: 4, bottom: 0, left: -14 }}>
// //               <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
// //               <XAxis dataKey="zone" tick={TICK_STYLE} axisLine={false} tickLine={false} />
// //               <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
// //               <Tooltip content={<ChartTooltip />} cursor={false} />
// //               <Bar dataKey="weekday" fill={WEEKDAY_COLOR} radius={[4, 4, 0, 0]} name="Weekday" maxBarSize={28} />
// //               <Bar dataKey="weekend" fill={WEEKEND_COLOR} radius={[4, 4, 0, 0]} name="Weekend" maxBarSize={28} />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {data.hourlyData.length > 0 && (
// //           <div className="an-chart-card an-chart-card--full">
// //             <div className="an-chart-card__head">
// //               <div>
// //                 <h3 className="an-chart-card__title">Hourly Traffic by Zone</h3>
// //                 <p className="an-chart-card__sub">All zones entries</p>
// //               </div>
// //               <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
// //                 {data.zones.map((z, i) => (
// //                   <span key={z} className="badge" style={{ background: `${ZONE_COLORS[i % ZONE_COLORS.length]}14`, color: ZONE_COLORS[i % ZONE_COLORS.length] }}>{z}</span>
// //                 ))}
// //               </div>
// //             </div>
// //             <div className="legend-row">
// //               {data.zones.map((z, i) => (
// //                 <span key={z} className="legend-item">
// //                   <span className="legend-dot" style={{ background: ZONE_COLORS[i % ZONE_COLORS.length] }} />{z}
// //                 </span>
// //               ))}
// //             </div>
// //             <ResponsiveContainer width="100%" height={240}>
// //               <AreaChart data={data.hourlyData} margin={CHART_MARGIN_FULL}>
// //                 <defs>
// //                   {data.zones.map((z, i) => (
// //                     <linearGradient key={z} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="0%" stopColor={ZONE_COLORS[i % ZONE_COLORS.length]} stopOpacity={0.22} />
// //                       <stop offset="100%" stopColor={ZONE_COLORS[i % ZONE_COLORS.length]} stopOpacity={0} />
// //                     </linearGradient>
// //                   ))}
// //                 </defs>
// //                 <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
// //                 <XAxis dataKey="hour" tick={TICK_STYLE} axisLine={false} tickLine={false} padding={XAXIS_PAD} />
// //                 <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={YAXIS_DOMAIN} />
// //                 <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
// //                 {data.zones.map((z, i) => (
// //                   <Area key={z} type="monotone" dataKey={z} stroke={ZONE_COLORS[i % ZONE_COLORS.length]} strokeWidth={1.8} fill={`url(#grad-${i})`} name={z} dot={false} connectNulls={true} activeDot={{ r: 4, fill: ZONE_COLORS[i % ZONE_COLORS.length], stroke: '#060B18', strokeWidth: 2 }} />
// //                 ))}
// //               </AreaChart>
// //             </ResponsiveContainer>
// //           </div>
// //         )}

// //         {data.hourlyData.length > 0 && (
// //           <div className="an-chart-card an-chart-card--full">
// //             <div className="an-chart-card__head">
// //               <div>
// //                 <h3 className="an-chart-card__title">Total Traffic by Hour</h3>
// //                 <p className="an-chart-card__sub">Combined across all zones</p>
// //               </div>
// //               <span className="badge badge--teal">Trend Line</span>
// //             </div>
// //             <ResponsiveContainer width="100%" height={190}>
// //               <LineChart data={data.hourlyData} margin={CHART_MARGIN_FULL}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
// //                 <XAxis dataKey="hour" tick={TICK_STYLE} axisLine={false} tickLine={false} padding={XAXIS_PAD} />
// //                 <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={YAXIS_DOMAIN} />
// //                 <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
// //                 <Line type="monotone" dataKey="total" stroke="#00C896" strokeWidth={2} name="Total" connectNulls={true} dot={{ r: 3, fill: '#00C896', stroke: '#060B18', strokeWidth: 1.5 }} activeDot={{ r: 5, fill: '#00C896', stroke: '#060B18', strokeWidth: 2 }} />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </div>
// //         )}
// //       </div>

// //       <div className="an-section-head">
// //         <div className="section-label">
// //           <ShoppingCart size={12} />
// //           Cashier Monitoring
// //           {absentCashiers > 0 && <span className="alert-chip"><AlertTriangle size={10} /> {absentCashiers} alert{absentCashiers !== 1 ? 's' : ''}</span>}
// //         </div>
// //       </div>
// //       <MonitorTable rows={data.cashiers} type="cashier" />

// //       <div className="an-section-head">
// //         <div className="section-label">
// //           <ShieldAlert size={12} />
// //           Security Monitoring
// //           {absentGuards > 0 && <span className="alert-chip"><AlertTriangle size={10} /> {absentGuards} alert{absentGuards !== 1 ? 's' : ''}</span>}
// //         </div>
// //       </div>
// //       <MonitorTable rows={data.security} type="security" />
// //     </div>
// //   );
// // }
// // newly updated 
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   CartesianGrid, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line,
// } from 'recharts';
// import {
//   Calendar, RefreshCw, Users, TrendingUp,
//   AlertTriangle, CheckCircle, ShieldAlert, ShoppingCart, Flame, X,
//   ChevronLeft, ChevronRight, Clock, Venus, Mars,
// } from 'lucide-react';
// import './Analytics.css';

// /*     constants     */
// const ZONE_COLORS = ['#00C896', '#7C6AF7', '#F5A623', '#F06068', '#22D3EE', '#A78BFA', '#34D399'];
// const WEEKDAY_COLOR = '#7C6AF7';
// const WEEKEND_COLOR = '#00C896';
// const todayStr = new Date().toISOString().split('T')[0];

// const TICK_STYLE = { fill: '#3A5068', fontSize: 10, fontFamily: 'DM Mono, monospace' };
// const GRID_STROKE = 'rgba(255,255,255,0.055)';
// const CHART_MARGIN_FULL = { top: 6, right: 4, bottom: 0, left: -10 };
// const XAXIS_PAD = { left: 8, right: 8 };
// const YAXIS_DOMAIN = [0, dataMax => Math.ceil(dataMax * 1.15) || 10];

// const EMPTY_DATA = {
//   zoneVisits: [],
//   hourlyData: [],
//   weekdayData: [],
//   wdPieData: [
//     { name: 'Weekday', value: 0, fill: WEEKDAY_COLOR, total: 0 },
//     { name: 'Weekend', value: 0, fill: WEEKEND_COLOR, total: 0 },
//   ],
//   wdGrandTotal: 0,
//   peakZone: { zone: 'N/A', count: 0, date: '' },
//   busiestDay: { day: 'N/A', count: 0, date: '' },
//   zones: [],
//   total: 0,
//   totalVisitorsToday: 0,
// };

// /*     pie label renderer     */
// const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   if (percent < 0.05) return null;
//   const RAD = Math.PI / 180;
//   const r = innerRadius + (outerRadius - innerRadius) * 0.58;
//   const x = cx + r * Math.cos(-midAngle * RAD);
//   const y = cy + r * Math.sin(-midAngle * RAD);
//   return (
//     <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#fff"
//       style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700, pointerEvents: 'none' }}>
//       {`${(percent * 100).toFixed(1)}%`}
//     </text>
//   );
// };

// /*     tooltips     */
// const ChartTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="an-tooltip">
//       <p className="an-tooltip__label">{label}</p>
//       {payload.map((p, i) => (
//         <p key={i} style={{ color: p.fill || p.stroke || p.color, marginTop: 4 }}>
//           {p.name}: <strong>{p.value?.toLocaleString()}</strong>
//         </p>
//       ))}
//     </div>
//   );
// };

// const PieTooltip = ({ active, payload }) => {
//   if (!active || !payload?.length) return null;
//   const d = payload[0];
//   return (
//     <div className="an-tooltip">
//       <p className="an-tooltip__label">{d.name}</p>
//       <p style={{ color: d.payload.fill, marginTop: 4 }}>
//         Visitors: <strong>{d.value?.toLocaleString()}</strong>
//       </p>
//       <p style={{ color: '#64748B', fontSize: 11, marginTop: 3 }}>
//         {((d.value / d.payload.total) * 100).toFixed(1)}% of total
//       </p>
//     </div>
//   );
// };

// /*     absent timer     */
// const AbsentTimer = ({ durationStr }) => {
//   if (!durationStr || durationStr === 'N/A') return <span className="absent-zero" />;
//   const cleaned = durationStr.toString().replace(/[^0-9.]/g, '');
//   const mins = parseFloat(cleaned);
//   if (isNaN(mins) || mins === 0) return <span className="absent-zero">0m</span>;
//   const h = Math.floor(mins / 60);
//   const m = Math.round(mins % 60);
//   const label = h > 0 ? `${h}h ${m}m` : `${Math.round(mins)}m`;
//   return <span className="absent-timer">{label}</span>;
// };

// /*     toast     */
// const Toast = ({ message, onClose }) => {
//   useEffect(() => {
//     if (!message) return;
//     const t = setTimeout(() => onClose(), 6000);
//     return () => clearTimeout(t);
//   }, [message, onClose]);
//   if (!message) return null;
//   return (
//     <div className="an-toast" role="alert">
//       <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: '#F06068' }} />
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontWeight: 600, marginBottom: 3, color: '#FFC5C8' }}>Data could not be fetched</div>
//         <div style={{ opacity: 0.75, fontSize: 11, wordBreak: 'break-word', lineHeight: 1.5 }}>{message}</div>
//       </div>
//       <button onClick={onClose} className="an-toast__close" aria-label="Dismiss">
//         <X size={13} />
//       </button>
//     </div>
//   );
// };

// /*     data helpers     */
// function parseHour(h) {
//   if (!h || typeof h !== 'string') return 0;
//   const parts = h.trim().split(' ');
//   let n = parseInt(parts[0], 10);
//   const period = parts[1]?.toUpperCase();
//   if (period === 'PM' && n !== 12) n += 12;
//   if (period === 'AM' && n === 12) n = 0;
//   return n;
// }

// function transformApiData(json) {
//   const {
//     zoneFootfall, hourlyByZone, weekdayVsWeekendByZone,
//     mostVisitedZone, busiestDayThisWeek, totalVisitorsToday,
//   } = json;

//   const total = Object.values(zoneFootfall || {}).reduce((s, v) => s + v, 0);
//   const zoneVisits = Object.entries(zoneFootfall || {}).map(([zone, count], i) => ({
//     zone, total: count, fill: ZONE_COLORS[i % ZONE_COLORS.length], totalSum: total,
//   }));

//   const zones = [...new Set(Object.keys(hourlyByZone || {}))];
//   const hourlyMap = {};
//   Object.entries(hourlyByZone || {}).forEach(([zone, hours]) => {
//     Object.entries(hours).forEach(([hour, counts]) => {
//       if (!hourlyMap[hour]) hourlyMap[hour] = { hour };
//       hourlyMap[hour][zone] = (counts.entry || 0) + (counts.exit || 0);
//     });
//   });
//   const hourlyData = Object.values(hourlyMap)
//     .sort((a, b) => parseHour(a.hour) - parseHour(b.hour))
//     .map(row => {
//       const filled = { ...row };
//       zones.forEach(z => { if (filled[z] == null) filled[z] = 0; });
//       filled.total = zones.reduce((s, z) => s + (filled[z] || 0), 0);
//       return filled;
//     });

//   const weekdayData = Object.entries(weekdayVsWeekendByZone || {}).map(([zone, val]) => ({
//     zone, weekday: val.weekday || 0, weekend: val.weekend || 0,
//   }));

//   const wdTotals = weekdayData.reduce(
//     (acc, z) => { acc[0].value += z.weekday; acc[1].value += z.weekend; return acc; },
//     [{ name: 'Weekday', value: 0, fill: WEEKDAY_COLOR }, { name: 'Weekend', value: 0, fill: WEEKEND_COLOR }]
//   );
//   const wdGrandTotal = wdTotals.reduce((s, d) => s + d.value, 0);
//   const wdPieData = wdTotals.map(d => ({ ...d, total: wdGrandTotal, value: d.value === 0 ? 0.0 : d.value }));

//   return {
//     zoneVisits, hourlyData, weekdayData, wdPieData, wdGrandTotal,
//     peakZone: mostVisitedZone || { zone: 'N/A', count: 0, date: '' },
//     busiestDay: busiestDayThisWeek || { day: 'N/A', count: 0, date: '' },
//     zones, total,
//     totalVisitorsToday: totalVisitorsToday || 0,
//   };
// }

// function transformDailyData(json) {
//   if (!json || !Array.isArray(json.dailySummary)) return [];
//   return json.dailySummary
//     .map(row => {
//       const mapAlerts = (arr = []) => arr.map((r, i) => {
//         const rawDuration = r.durationMinutes ?? r.absentDurationAlert ?? 'N/A';
//         const numericMins = parseFloat(rawDuration.toString().replace(/[^0-9.]/g, ''));
//         return {
//           id: i,
//           counter: r.cameraId ?? r.counter ?? `#${i + 1}`,
//           zone: r.zone ?? '',
//           status: 'absent',
//           lastSeen: r.triggeredTime ?? r.lastSeen ?? 'N/A',
//           absentDurationAlert: isNaN(numericMins) ? 'N/A' : String(numericMins),
//           resolvedTime: r.resolvedTime ?? 'N/A',
//           isOngoing: r.isOngoing ?? false,
//         };
//       });
//       return {
//         date: row.date,
//         totalFootfall: row.totalFootfall ?? 0,
//         malePercent: row.malePercent ?? null,
//         femalePercent: row.femalePercent ?? null,
//         peakHour: row.peakHour ?? null,
//         cashierAlerts: mapAlerts(row.cashierAlerts ?? row.counterSummary),
//         securityAlerts: mapAlerts(row.securityAlerts ?? row.securitySummary),
//       };
//     })
//     .sort((a, b) => (a.date < b.date ? 1 : -1));
// }

// /* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//    ALERT POPUP
// PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
// const AlertPopup = ({ type, date, alerts, onClose }) => {
//   const popupRef = useRef(null);
//   useEffect(() => {
//     const handler = (e) => { if (popupRef.current && !popupRef.current.contains(e.target)) onClose(); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [onClose]);

//   const accentColor = type === 'cashier' ? '#F5A623' : '#7C6AF7';
//   const Icon = type === 'cashier' ? ShoppingCart : ShieldAlert;

//   return (
//     <div className="alert-popup-overlay">
//       <div ref={popupRef} className="alert-popup" style={{ border: `1px solid ${accentColor}28` }}>
//         <div className="alert-popup__header" style={{ background: `${accentColor}08`, borderBottom: `1px solid ${accentColor}18` }}>
//           <div className="alert-popup__title">
//             <Icon size={13} style={{ color: accentColor }} />
//             <span>{type === 'cashier' ? 'Cashier' : 'Security'} Alerts</span>
//             <span className="alert-popup__date-pill" style={{ background: `${accentColor}20`, color: accentColor }}>
//               {date}
//             </span>
//           </div>
//           <button onClick={onClose} className="alert-popup__close">
//             <X size={13} />
//           </button>
//         </div>

//         <div className="alert-popup__body">
//           {alerts.length === 0 ? (
//             <div className="alert-popup__empty">
//               <CheckCircle size={24} style={{ opacity: 0.35, color: '#00C896' }} />
//               <span>No alerts on this day</span>
//             </div>
//           ) : (
//             <table className="popup-table">
//               <thead>
//                 <tr>
//                   {['Camera', 'Zone', 'Triggered At', 'Duration', 'Resolved At'].map(h => (
//                     <th key={h}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {alerts.map((r, i) => (
//                   <tr key={i}>
//                     <td className="popup-td-camera">{r.counter}</td>
//                     <td>
//                       <span className="popup-zone-pill" style={{ background: `${accentColor}15`, color: accentColor }}>
//                         {r.zone || ''}
//                       </span>
//                     </td>
//                     <td className="popup-td-muted">{r.lastSeen}</td>
//                     <td><AbsentTimer durationStr={r.absentDurationAlert} /></td>
//                     <td>
//                       {r.isOngoing
//                         ? <span className="popup-ongoing">Ongoing</span>
//                         : (r.resolvedTime && r.resolvedTime !== 'N/A'
//                           ? <span className="popup-td-muted">{r.resolvedTime}</span>
//                           : <span style={{ opacity: 0.25 }}></span>)
//                       }
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//    DAILY BREAKDOWN TABLE
// PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
// const DailyBreakdownTable = ({ dailyRows }) => {
//   const PAGE_SIZE = 7;
//   const [page, setPage] = useState(0);
//   const [popup, setPopup] = useState(null);

//   const totalPages = Math.ceil(dailyRows.length / PAGE_SIZE);
//   const visible = dailyRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

//   const fmtDate = (str) => {
//     if (!str) return '';
//     return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };
//   const fmtDay = (str) => {
//     if (!str) return '';
//     return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' });
//   };
//   const isWeekend = (str) => {
//     if (!str) return false;
//     const day = new Date(str + 'T00:00:00').getDay();
//     return day === 0 || day === 6;
//   };

//   return (
//     <>
//       {popup && (
//         <AlertPopup
//           type={popup.type}
//           date={fmtDate(popup.date)}
//           alerts={popup.alerts}
//           onClose={() => setPopup(null)}
//         />
//       )}

//       <div className="daily-breakdown-wrap">
//         {/* Pagination strip */}
//         <div className="daily-pager-strip">
//           <span className="daily-pager-info an-chart-card__sub">
//             Showing {dailyRows.length === 0 ? 0 : page * PAGE_SIZE + 1}{Math.min((page + 1) * PAGE_SIZE, dailyRows.length)} of {dailyRows.length} days
//           </span>
//           <div className="daily-pager-controls">
//             <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="pager-btn">
//               <ChevronLeft size={13} />
//             </button>
//             {Array.from({ length: totalPages }).map((_, i) => (
//               <button key={i} onClick={() => setPage(i)} className={`pager-dot ${i === page ? 'pager-dot--active' : ''}`} />
//             ))}
//             <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="pager-btn">
//               <ChevronRight size={13} />
//             </button>
//           </div>
//         </div>

//         <div style={{ overflowX: 'auto' }}>
//           <table className="daily-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: 700 }}>
//             <colgroup>
//               <col style={{ width: '15%' }} />
//               <col style={{ width: '13%' }} />
//               <col style={{ width: '12%' }} />
//               <col style={{ width: '12%' }} />
//               <col style={{ width: '13%' }} />
//               <col style={{ width: '17.5%' }} />
//               <col style={{ width: '17.5%' }} />
//             </colgroup>
//             <thead>
//               <tr>
//                 {[
//                   { icon: <Calendar size={10} style={{ opacity: 0.45 }} />, label: 'Date' },
//                   { icon: <Users size={10} style={{ opacity: 0.45 }} />, label: 'Footfall' },
//                   { icon: <Mars size={10}  style={{ opacity: 0.45, color: '#22D3EE' }} />, label: 'Male %' },
//                   { icon: <Venus size={10} style={{ opacity: 0.45, color: '#F06068' }} />, label: 'Female %' },
//                   { icon: <Clock size={10} fontFamily='DM Mono' style={{ opacity: 0.45 }} />, label: 'Peak Hour' },
//                   { icon: <ShoppingCart size={10} style={{ opacity: 0.45, color: '#F5A623' }} />, label: 'Cashier Alerts' },
//                   { icon: <ShieldAlert size={10} style={{ opacity: 0.45, color: '#7C6AF7' }} />, label: 'Security Alerts' },
//                 ].map(({ icon, label }) => (
//                   <th key={label}>
//                     <span className='an-chart-card__title' style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{icon}{label}</span>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {visible.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: '#3A4E65', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>
//                     No daily data available
//                   </td>
//                 </tr>
//               ) : visible.map((row) => {
//                 const weekend = isWeekend(row.date);
//                 const cashierCount = row.cashierAlerts?.length ?? 0;
//                 const securityCount = row.securityAlerts?.length ?? 0;
//                 return (
//                   <tr key={row.date} className={weekend ? 'daily-row--weekend' : ''}>
//                     {/* Date */}
//                     <td>
//                       <div className="daily-cell-date">
//                         <span className="daily-cell-date-main">{fmtDate(row.date)}</span>
//                         <span className={`daily-cell-date-sub ${weekend ? 'daily-cell-date-sub--weekend' : ''}`}>
//                           {fmtDay(row.date)}{weekend ? ' � Weekend' : ''}
//                         </span>
//                       </div>
//                     </td>

//                     {/* Footfall */}
//                     <td>
//                       <span className="daily-cell-footfall">{(row.totalFootfall ?? 0).toLocaleString()}</span>
//                     </td>

//                     {/* Male % */}
//                     <td>
//                       <div className="daily-cell-gender">
//                         <span className="daily-cell-gender-val daily-cell-gender--male">
//                           {row.malePercent != null ? `${row.malePercent.toFixed(1)}%` : ''}
//                         </span>
//                         {row.malePercent != null && (
//                           <div className="daily-cell-gender-bar">
//                             <div className="daily-cell-gender-fill" style={{ width: `${row.malePercent}%`, background: '#22D3EE' }} />
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     {/* Female % */}
//                     <td>
//                       <div className="daily-cell-gender">
//                         <span className="daily-cell-gender-val daily-cell-gender--female">
//                           {row.femalePercent != null ? `${row.femalePercent.toFixed(1)}%` : ''}
//                         </span>
//                         {row.femalePercent != null && (
//                           <div className="daily-cell-gender-bar">
//                             <div className="daily-cell-gender-fill" style={{ width: `${row.femalePercent}%`, background: '#F06068' }} />
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     {/* Peak Hour */}
//                     <td>
//                       <span className="daily-cell-peak">
//                         <Clock size={9} />{row.peakHour || ''}
//                       </span>
//                     </td>

//                     {/* Cashier Alerts */}
//                     <td>
//                       {cashierCount === 0 ? (
//                         <span className="daily-alert-none"><CheckCircle size={11} />None</span>
//                       ) : (
//                         <button
//                           className="daily-alert-btn daily-alert-btn--cashier"
//                           onClick={() => setPopup({ type: 'cashier', date: row.date, alerts: row.cashierAlerts || [] })}
//                         >
//                           <AlertTriangle size={10} />
//                           {cashierCount} alert{cashierCount !== 1 ? 's' : ''}
//                         </button>
//                       )}
//                     </td>

//                     {/* Security Alerts */}
//                     <td>
//                       {securityCount === 0 ? (
//                         <span className="daily-alert-none"><CheckCircle size={11} />None</span>
//                       ) : (
//                         <button
//                           className="daily-alert-btn daily-alert-btn--security"
//                           onClick={() => setPopup({ type: 'security', date: row.date, alerts: row.securityAlerts || [] })}
//                         >
//                           <AlertTriangle size={10} />
//                           {securityCount} alert{securityCount !== 1 ? 's' : ''}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// /* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//    KPI CARD
// PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
// const KpiCard = ({ variant, icon: Icon, label, value, sub }) => (
//   <div className={`an-kpi an-kpi--${variant}`}>
//     <div className="an-kpi__icon"><Icon size={20} /></div>
//     <div className="an-kpi__body">
//       <p className="an-kpi__label">{label}</p>
//       <h3 className="an-kpi__val">{value}</h3>
//       {sub && <p className="an-kpi__sub">{sub}</p>}
//     </div>
//   </div>
// );

// /* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//    SECTION HEADER
// PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
// const SectionHead = ({ icon: Icon, label, badge, aside, style }) => (
//   <div className="an-section-head" style={style}>
//     <div className="section-label">
//       <Icon size={12} />
//       {label}
//       {badge && <span className="an-section-badge">{badge}</span>}
//     </div>
//     {aside}
//   </div>
// );
// const getIsAdmin = () => {
//   const stored = localStorage.getItem('is_admin');
//   if (stored !== null) return stored === 'true';
//   const token = localStorage.getItem('token');
//   if (!token) return false;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.is_admin === true;
//   } catch {
//     return false;
//   }
// };

// /* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//    MAIN ANALYTICS COMPONENT
// PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
// export default function Analytics() {
//   const [activeDate, setActiveDate] = useState(todayStr);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [lastUpdated, setLast] = useState(null);
//   const [toastMsg, setToastMsg] = useState(null);
//   const [dailyRows, setDailyRows] = useState([]);
//   const [dailyRange, setDailyRange] = useState(30);

//   /*    fetch main analytics    */
//   const fetchData = useCallback(async (silent = false) => {
//     if (!silent) setLoading(true);
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics?date=${activeDate}`);
//       const json = await res.json();
//       const newData = transformApiData(json);
//       if (silent) {
//         setData(prev => JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData);
//       } else {
//         setData(newData);
//         setLast(new Date().toLocaleTimeString());
//       }
//       setToastMsg(null);
//     } catch (e) {
//       console.error(e);
//       setData(prev => prev ?? EMPTY_DATA);
//       setToastMsg(e.message || 'Unable to reach the analytics server.');
//       if (!silent) setLast(new Date().toLocaleTimeString());
//     }
//     if (!silent) setLoading(false);
//   }, [activeDate]);

//   /*    fetch daily summary    */
//   const fetchDailySummary = useCallback(async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics?date=${activeDate}`);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       setDailyRows(transformDailyData(json));
//     } catch (e) {
//       console.warn('Daily summary fetch failed:', e.message);
//     }
//   }, [activeDate]);

//   useEffect(() => {
//     fetchData(false);
//     fetchDailySummary();
//     let id;
//     if (activeDate === todayStr) id = setInterval(() => fetchData(true), 5000);
//     return () => clearInterval(id);
//   }, [activeDate]);

//   const formatDisplayDate = (str) => {
//     if (!str) return '';
//     return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   /*    loading state    */
//   if (!data) return (
//     <div className="an-loading">
//       <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
//       <div className="an-loading__spinner" />
//       <p>Loading analytics&</p>
//     </div>
//   );

//   const isToday = activeDate === todayStr;
//   const totalVisitors = data.zoneVisits.reduce((s, z) => s + z.total, 0);
//   const pieData = data.zoneVisits.map(z => ({ ...z, value: z.total }));
//   const visiblePieData = pieData.filter(d => d.value > 0);
//   const visibleWdPieData = data.wdPieData.filter(d => d.value > 0);
//   const filteredDailyRows = dailyRange === 7 ? dailyRows.slice(0, 7) : dailyRows;

//   return (
//     <div className="an-page">
//       <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

//       {/* PP HEADER PP */}
//       <div className="an-header">
//         <div className="an-header__left">
//           <h1 className="an-title">Zone <span>Analytics</span></h1>
//           <div className="an-sub">
//             <span className="an-sub-date">{formatDisplayDate(activeDate)}</span>
//             {isToday && (
//               <span className="an-sub-live">
//                 <span className="live-dot" />Live
//               </span>
//             )}
//             {lastUpdated && (
//               <>
//                 <span className="an-sub-sep">�</span>
//                 <span>Updated {lastUpdated}</span>
//               </>
//             )}
//             {loading && <span className="spinner" style={{ marginLeft: 4 }} />}
//           </div>
//         </div>

//         <div className="an-controls">
//           <div className="date-wrap">
//             <Calendar size={13} className="date-wrap__icon" />
//             <input
//               type="date"
//               className="date-input"
//               value={activeDate}
//               max={todayStr}
//               onChange={e => { if (e.target.value) setActiveDate(e.target.value); }}
//             />
//           </div>
//           <button className="btn-refresh" onClick={() => fetchData(false)} disabled={loading}>
//             <RefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none', display: 'block' }} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* PP KPI ROW PP */}
//       <div className="an-kpi-row">
//         <KpiCard
//           variant="teal"
//           icon={Users}
//           label="Total Visitors"
//           value={data.totalVisitorsToday.toLocaleString()}
//           sub={``}
//         />
//         <KpiCard
//           variant="amber"
//           icon={TrendingUp}
//           label="Peak Zone"
//           value={
//             <span>
//               {data.peakZone.zone}
//               {data.peakZone.count > 0 && (
//                 <span style={{ fontSize: '0.6em', opacity: 0.55, marginLeft: 8, fontWeight: 400 }}>
//                   {data.peakZone.count.toLocaleString()} visits
//                 </span>
//               )}
//             </span>
//           }
//         />
//         <KpiCard
//           variant="violet"
//           icon={Flame}
//           label="Busiest Day This Week"
//           value={
//             <span>
//               {data.busiestDay.day}
//               {data.busiestDay.count > 0 && (
//                 <span style={{ fontSize: '0.6em', opacity: 0.55, marginLeft: 8, fontWeight: 400 }}>
//                   {data.busiestDay.count.toLocaleString()} visits
//                 </span>
//               )}
//             </span>
//           }
         
//         />
//       </div>

//       {/* PP CHARTS GRID PP */}
//       <div className="an-charts-grid">

//         {/* Zone Distribution */}
//         <div className="an-chart-card">
//           <div className="an-chart-card__head">
//             <div>
//               <h3 className="an-chart-card__title">Zone Distribution</h3>
//               <p className="an-chart-card__sub">Footfall share by zone</p>
//             </div>
//             <span className="badge badge--teal">Footfall %</span>
//           </div>

//           <ResponsiveContainer width="100%" height={220}>
//             <PieChart>
//               <Pie
//                 data={visiblePieData} cx="50%" cy="50%"
//                 innerRadius="32%" outerRadius="74%"
//                 paddingAngle={visiblePieData.length > 1 ? 2 : 0}
//                 startAngle={90} endAngle={-270}
//                 dataKey="value" stroke="none"
//                 label={renderPieLabel} labelLine={false}
//               >
//                 {visiblePieData.map(entry => <Cell key={entry.zone} fill={entry.fill} />)}
//               </Pie>
//               <Tooltip content={<PieTooltip />} />
//             </PieChart>
//           </ResponsiveContainer>

//           <div className="pie-legend" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 12 }}>
//             {pieData.map(z => (
//               <div key={z.zone} className="pie-legend-item">
//                 <span className="pie-legend-dot" style={{ background: z.fill }} />
//                 <span className="pie-legend-label">{z.zone}:</span>
//                 <span className="pie-legend-val">{z.total.toLocaleString()}</span>
//                 <span className="pie-legend-pct">
//                   {totalVisitors > 0 ? ((z.total / totalVisitors) * 100).toFixed(1) : 0}%
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Weekday vs Weekend */}
//         <div className="an-chart-card">
//           <div className="an-chart-card__head">
//             <div>
//               <h3 className="an-chart-card__title">Weekday vs Weekend</h3>
//               <p className="an-chart-card__sub">Traffic pattern split</p>
//             </div>
//             <div style={{ display: 'flex', gap: 5 }}>
//               <span className="badge badge--violet">Weekday</span>
//               <span className="badge badge--teal">Weekend</span>
//             </div>
//           </div>

//           <div className="wd-split-layout">
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie
//                   data={visibleWdPieData} cx="50%" cy="50%"
//                   innerRadius="32%" outerRadius="80%"
//                   paddingAngle={visibleWdPieData.length > 1 ? 3 : 0}
//                   startAngle={90} endAngle={-270}
//                   dataKey="value" stroke="none"
//                   label={renderPieLabel} labelLine={false}
//                 >
//                   {visibleWdPieData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
//                 </Pie>
//                 <Tooltip content={<PieTooltip />} />
//               </PieChart>
//             </ResponsiveContainer>

//             <div className="wd-stat-col">
//               {data.wdPieData.map(d => (
//                 <div key={d.name} className="wd-stat-item">
//                   <span className="wd-stat-label" style={{ color: d.fill }}>{d.name}</span>
//                   <span className="wd-stat-val" style={{ color: d.fill }}>{d.value.toLocaleString()}</span>
//                   <div className="wd-bar-track">
//                     <div className="wd-bar-fill" style={{
//                       background: d.fill,
//                       width: `${data.wdGrandTotal > 0 ? ((d.value / data.wdGrandTotal) * 100).toFixed(1) : 0}%`,
//                     }} />
//                   </div>
//                   <span className="wd-pct">
//                     {data.wdGrandTotal > 0 ? ((d.value / data.wdGrandTotal) * 100).toFixed(1) : 0}% of total
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="divider-line" />
//           <p className="an-chart-card__title" style={{ marginBottom: 10 }}>By Zone</p>
//           <ResponsiveContainer width="100%" height={140}>
//             <BarChart data={data.weekdayData} barCategoryGap="28%" barGap={3} margin={{ top: 2, right: 4, bottom: 0, left: -14 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
//               <XAxis dataKey="zone" tick={TICK_STYLE} axisLine={false} tickLine={false} />
//               <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
//               <Tooltip content={<ChartTooltip />} cursor={false} />
//               <Bar dataKey="weekday" fill={WEEKDAY_COLOR} radius={[4, 4, 0, 0]} name="Weekday" maxBarSize={26} />
//               <Bar dataKey="weekend" fill={WEEKEND_COLOR} radius={[4, 4, 0, 0]} name="Weekend" maxBarSize={26} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Hourly Traffic by Zone */}
//         {data.hourlyData.length > 0 && (
//           <div className="an-chart-card an-chart-card--full">
//             <div className="an-chart-card__head">
//               <div>
//                 <h3 className="an-chart-card__title">Hourly Traffic by Zone</h3>
//                 <p className="an-chart-card__sub">Entry + exit counts per hour</p>
//               </div>
//               <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
//                 {data.zones.map((z, i) => (
//                   <span key={z} className="badge" style={{ background: `${ZONE_COLORS[i % ZONE_COLORS.length]}14`, color: ZONE_COLORS[i % ZONE_COLORS.length] }}>
//                     {z}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div className="legend-row">
//               {data.zones.map((z, i) => (
//                 <span key={z} className="legend-item">
//                   <span className="legend-dot" style={{ background: ZONE_COLORS[i % ZONE_COLORS.length] }} />{z}
//                 </span>
//               ))}
//             </div>
//             <ResponsiveContainer width="100%" height={230}>
//               <AreaChart data={data.hourlyData} margin={CHART_MARGIN_FULL}>
//                 <defs>
//                   {data.zones.map((z, i) => (
//                     <linearGradient key={z} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor={ZONE_COLORS[i % ZONE_COLORS.length]} stopOpacity={0.2} />
//                       <stop offset="100%" stopColor={ZONE_COLORS[i % ZONE_COLORS.length]} stopOpacity={0} />
//                     </linearGradient>
//                   ))}
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
//                 <XAxis dataKey="hour" tick={TICK_STYLE} axisLine={false} tickLine={false} padding={XAXIS_PAD} />
//                 <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={YAXIS_DOMAIN} />
//                 <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 }} />
//                 {data.zones.map((z, i) => (
//                   <Area
//                     key={z} type="monotone" dataKey={z}
//                     stroke={ZONE_COLORS[i % ZONE_COLORS.length]} strokeWidth={1.8}
//                     fill={`url(#grad-${i})`} name={z} dot={false} connectNulls
//                     activeDot={{ r: 4, fill: ZONE_COLORS[i % ZONE_COLORS.length], stroke: '#060B18', strokeWidth: 2 }}
//                   />
//                 ))}
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         {/* Total Traffic Trend */}
//         {data.hourlyData.length > 0 && (
//           <div className="an-chart-card an-chart-card--full">
//             <div className="an-chart-card__head">
//               <div>
//                 <h3 className="an-chart-card__title">Total Traffic by Hour</h3>
//                 <p className="an-chart-card__sub">Combined footfall across all zones</p>
//               </div>
//               <span className="badge badge--teal">Trend Line</span>
//             </div>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={data.hourlyData} margin={CHART_MARGIN_FULL}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
//                 <XAxis dataKey="hour" tick={TICK_STYLE} axisLine={false} tickLine={false} padding={XAXIS_PAD} />
//                 <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={YAXIS_DOMAIN} />
//                 <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 }} />
//                 <Line
//                   type="monotone" dataKey="total" stroke="#00C896" strokeWidth={2.2}
//                   name="Total" connectNulls
//                   dot={{ r: 3, fill: '#00C896', stroke: '#060B18', strokeWidth: 1.5 }}
//                   activeDot={{ r: 5, fill: '#00C896', stroke: '#060B18', strokeWidth: 2 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//       {/* PP DAILY BREAKDOWN PP */}
//       <SectionHead
//         icon={Calendar}
//         label="Daily Breakdown"
//         badge={dailyRange === 7 ? 'Last 7 Days' : 'Last 30 Days'}
//         style={{ marginTop: 36 }}
//         aside={
//           <div style={{ display: 'flex', gap: 4 }}>
//             {[7, 30].map(r => (
//               <button
//                 key={r}
//                 onClick={() => setDailyRange(r)}
//                 className={`range-toggle-btn ${dailyRange === r ? 'range-toggle-btn--active' : ''}`}
//               >
//                 {r}d
//               </button>
//             ))}
//           </div>
//         }
//       />

//       <p className="daily-help-text an-chart-card__title">
//         Click any alert count to see the full breakdown.
//       </p>

//       <DailyBreakdownTable dailyRows={filteredDailyRows} />
//     </div>
//   );
// }
// NEW UPDATED
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, AreaChart, Area, LineChart, Line,
} from 'recharts';
import {
  Calendar, RefreshCw, Users, TrendingUp,
  AlertTriangle, CheckCircle, ShieldAlert, ShoppingCart, Flame, X,
  ChevronLeft, ChevronRight, Clock, Venus, Mars, Store,
} from 'lucide-react';
import './Analytics.css';

/*  constants  */
const API_BASE = import.meta.env.VITE_API_URL;
const ZONE_COLORS = ['#00C896', '#7C6AF7', '#F5A623', '#F06068', '#22D3EE', '#A78BFA', '#34D399'];
const WEEKDAY_COLOR = '#7C6AF7';
const WEEKEND_COLOR = '#00C896';
const todayStr = new Date().toISOString().split('T')[0];

const TICK_STYLE = { fill: '#3A5068', fontSize: 10, fontFamily: 'DM Mono, monospace' };
const GRID_STROKE = 'rgba(255,255,255,0.055)';
const CHART_MARGIN_FULL = { top: 6, right: 4, bottom: 0, left: -10 };
const XAXIS_PAD = { left: 8, right: 8 };
const YAXIS_DOMAIN = [0, dataMax => Math.ceil(dataMax * 1.15) || 10];

const EMPTY_DATA = {
  zoneVisits: [],
  hourlyData: [],
  weekdayData: [],
  wdPieData: [
    { name: 'Weekday', value: 0, fill: WEEKDAY_COLOR, total: 0 },
    { name: 'Weekend', value: 0, fill: WEEKEND_COLOR, total: 0 },
  ],
  wdGrandTotal: 0,
  peakZone: { zone: 'N/A', count: 0, date: '' },
  busiestDay: { day: 'N/A', count: 0, date: '' },
  zones: [],
  total: 0,
  totalVisitorsToday: 0,
};

/*  auth helpers  */
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

/*  pie label renderer  */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RAD = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.58;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#fff"
      style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700, pointerEvents: 'none' }}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

/*  tooltips  */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="an-tooltip">
      <p className="an-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.stroke || p.color, marginTop: 4 }}>
          {p.name}: <strong>{p.value?.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="an-tooltip">
      <p className="an-tooltip__label">{d.name}</p>
      <p style={{ color: d.payload.fill, marginTop: 4 }}>
        Visitors: <strong>{d.value?.toLocaleString()}</strong>
      </p>
      <p style={{ color: '#64748B', fontSize: 11, marginTop: 3 }}>
        {((d.value / d.payload.total) * 100).toFixed(1)}% of total
      </p>
    </div>
  );
};

/*  absent timer  */
const AbsentTimer = ({ durationStr }) => {
  if (!durationStr || durationStr === 'N/A') return <span className="absent-zero" />;
  const cleaned = durationStr.toString().replace(/[^0-9.]/g, '');
  const mins = parseFloat(cleaned);
  if (isNaN(mins) || mins === 0) return <span className="absent-zero">0m</span>;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  const label = h > 0 ? `${h}h ${m}m` : `${Math.round(mins)}m`;
  return <span className="absent-timer">{label}</span>;
};

/*  toast  */
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose(), 6000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="an-toast" role="alert">
      <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: '#F06068' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 3, color: '#FFC5C8' }}>Data could not be fetched</div>
        <div style={{ opacity: 0.75, fontSize: 11, wordBreak: 'break-word', lineHeight: 1.5 }}>{message}</div>
      </div>
      <button onClick={onClose} className="an-toast__close" aria-label="Dismiss">
        <X size={13} />
      </button>
    </div>
  );
};

/*  data helpers  */
function parseHour(h) {
  if (!h || typeof h !== 'string') return 0;
  const parts = h.trim().split(' ');
  let n = parseInt(parts[0], 10);
  const period = parts[1]?.toUpperCase();
  if (period === 'PM' && n !== 12) n += 12;
  if (period === 'AM' && n === 12) n = 0;
  return n;
}

function transformApiData(json) {
  const {
    zoneFootfall, hourlyByZone, weekdayVsWeekendByZone,
    mostVisitedZone, busiestDayThisWeek, totalVisitorsToday,
  } = json;

  const total = Object.values(zoneFootfall || {}).reduce((s, v) => s + v, 0);
  const zoneVisits = Object.entries(zoneFootfall || {}).map(([zone, count], i) => ({
    zone, total: count, fill: ZONE_COLORS[i % ZONE_COLORS.length], totalSum: total,
  }));

  const zones = [...new Set(Object.keys(hourlyByZone || {}))];
  const hourlyMap = {};
  Object.entries(hourlyByZone || {}).forEach(([zone, hours]) => {
    Object.entries(hours).forEach(([hour, counts]) => {
      if (!hourlyMap[hour]) hourlyMap[hour] = { hour };
      hourlyMap[hour][zone] = (counts.entry || 0) + (counts.exit || 0);
    });
  });
  const hourlyData = Object.values(hourlyMap)
    .sort((a, b) => parseHour(a.hour) - parseHour(b.hour))
    .map(row => {
      const filled = { ...row };
      zones.forEach(z => { if (filled[z] == null) filled[z] = 0; });
      filled.total = zones.reduce((s, z) => s + (filled[z] || 0), 0);
      return filled;
    });

  const weekdayData = Object.entries(weekdayVsWeekendByZone || {}).map(([zone, val]) => ({
    zone, weekday: val.weekday || 0, weekend: val.weekend || 0,
  }));

  const wdTotals = weekdayData.reduce(
    (acc, z) => { acc[0].value += z.weekday; acc[1].value += z.weekend; return acc; },
    [{ name: 'Weekday', value: 0, fill: WEEKDAY_COLOR }, { name: 'Weekend', value: 0, fill: WEEKEND_COLOR }]
  );
  const wdGrandTotal = wdTotals.reduce((s, d) => s + d.value, 0);
  const wdPieData = wdTotals.map(d => ({ ...d, total: wdGrandTotal, value: d.value === 0 ? 0.0 : d.value }));

  return {
    zoneVisits, hourlyData, weekdayData, wdPieData, wdGrandTotal,
    peakZone: mostVisitedZone || { zone: 'N/A', count: 0, date: '' },
    busiestDay: busiestDayThisWeek || { day: 'N/A', count: 0, date: '' },
    zones, total,
    totalVisitorsToday: totalVisitorsToday || 0,
  };
}

function transformDailyData(json) {
  if (!json || !Array.isArray(json.dailySummary)) return [];
  return json.dailySummary
    .map(row => {
      const mapAlerts = (arr = []) => arr.map((r, i) => {
        const rawDuration = r.durationMinutes ?? r.absentDurationAlert ?? 'N/A';
        const numericMins = parseFloat(rawDuration.toString().replace(/[^0-9.]/g, ''));
        return {
          id: i,
          counter: r.cameraId ?? r.counter ?? `#${i + 1}`,
          zone: r.zone ?? '',
          status: 'absent',
          lastSeen: r.triggeredTime ?? r.lastSeen ?? 'N/A',
          absentDurationAlert: isNaN(numericMins) ? 'N/A' : String(numericMins),
          resolvedTime: r.resolvedTime ?? 'N/A',
          isOngoing: r.isOngoing ?? false,
        };
      });
      return {
        date: row.date,
        totalFootfall: row.totalFootfall ?? 0,
        malePercent: row.malePercent ?? null,
        femalePercent: row.femalePercent ?? null,
        peakHour: row.peakHour ?? null,
        cashierAlerts: mapAlerts(row.cashierAlerts ?? row.counterSummary),
        securityAlerts: mapAlerts(row.securityAlerts ?? row.securitySummary),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
   ALERT POPUP
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
const AlertPopup = ({ type, date, alerts, onClose }) => {
  const popupRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (popupRef.current && !popupRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const accentColor = type === 'cashier' ? '#F5A623' : '#7C6AF7';
  const Icon = type === 'cashier' ? ShoppingCart : ShieldAlert;

  return (
    <div className="alert-popup-overlay">
      <div ref={popupRef} className="alert-popup" style={{ border: `1px solid ${accentColor}28` }}>
        <div className="alert-popup__header" style={{ background: `${accentColor}08`, borderBottom: `1px solid ${accentColor}18` }}>
          <div className="alert-popup__title">
            <Icon size={13} style={{ color: accentColor }} />
            <span>{type === 'cashier' ? 'Cashier' : 'Security'} Alerts</span>
            <span className="alert-popup__date-pill" style={{ background: `${accentColor}20`, color: accentColor }}>
              {date}
            </span>
          </div>
          <button onClick={onClose} className="alert-popup__close">
            <X size={13} />
          </button>
        </div>

        <div className="alert-popup__body">
          {alerts.length === 0 ? (
            <div className="alert-popup__empty">
              <CheckCircle size={24} style={{ opacity: 0.35, color: '#00C896' }} />
              <span>No alerts on this day</span>
            </div>
          ) : (
            <table className="popup-table">
              <thead>
                <tr>
                  {['Camera', 'Zone', 'Triggered At', 'Duration', 'Resolved At'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alerts.map((r, i) => (
                  <tr key={i}>
                    <td className="popup-td-camera">{r.counter}</td>
                    <td>
                      <span className="popup-zone-pill" style={{ background: `${accentColor}15`, color: accentColor }}>
                        {r.zone || ''}
                      </span>
                    </td>
                    <td className="popup-td-muted">{r.lastSeen}</td>
                    <td><AbsentTimer durationStr={r.absentDurationAlert} /></td>
                    <td>
                      {r.isOngoing
                        ? <span className="popup-ongoing">Ongoing</span>
                        : (r.resolvedTime && r.resolvedTime !== 'N/A'
                          ? <span className="popup-td-muted">{r.resolvedTime}</span>
                          : <span style={{ opacity: 0.25 }}></span>)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
   DAILY BREAKDOWN TABLE
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
const DailyBreakdownTable = ({ dailyRows }) => {
  const PAGE_SIZE = 7;
  const [page, setPage] = useState(0);
  const [popup, setPopup] = useState(null);

  const totalPages = Math.ceil(dailyRows.length / PAGE_SIZE);
  const visible = dailyRows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const fmtDate = (str) => {
    if (!str) return '';
    return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const fmtDay = (str) => {
    if (!str) return '';
    return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' });
  };
  const isWeekend = (str) => {
    if (!str) return false;
    const day = new Date(str + 'T00:00:00').getDay();
    return day === 0 || day === 6;
  };

  return (
    <>
      {popup && (
        <AlertPopup
          type={popup.type}
          date={fmtDate(popup.date)}
          alerts={popup.alerts}
          onClose={() => setPopup(null)}
        />
      )}

      <div className="daily-breakdown-wrap">
        {/* Pagination strip */}
        <div className="daily-pager-strip">
          <span className="daily-pager-info an-chart-card__sub">
            Showing {dailyRows.length === 0 ? 0 : page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, dailyRows.length)} of {dailyRows.length} days
          </span>
          <div className="daily-pager-controls">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="pager-btn">
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`pager-dot ${i === page ? 'pager-dot--active' : ''}`} />
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="pager-btn">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="daily-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: 700 }}>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '17.5%' }} />
              <col style={{ width: '17.5%' }} />
            </colgroup>
            <thead>
              <tr>
                {[
                  { icon: <Calendar size={10} style={{ opacity: 0.45 }} />, label: 'Date' },
                  { icon: <Users size={10} style={{ opacity: 0.45 }} />, label: 'Footfall' },
                  { icon: <Mars size={10}  style={{ opacity: 0.45, color: '#22D3EE' }} />, label: 'Male %' },
                  { icon: <Venus size={10} style={{ opacity: 0.45, color: '#F06068' }} />, label: 'Female %' },
                  { icon: <Clock size={10} style={{ opacity: 0.45 }} />, label: 'Peak Hour' },
                  { icon: <ShoppingCart size={10} style={{ opacity: 0.45, color: '#F5A623' }} />, label: 'Cashier Alerts' },
                  { icon: <ShieldAlert size={10} style={{ opacity: 0.45, color: '#7C6AF7' }} />, label: 'Security Alerts' },
                ].map(({ icon, label }) => (
                  <th key={label}>
                    <span className='an-chart-card__title' style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{icon}{label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: '#3A4E65', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>
                    No daily data available
                  </td>
                </tr>
              ) : visible.map((row) => {
                const weekend = isWeekend(row.date);
                const cashierCount = row.cashierAlerts?.length ?? 0;
                const securityCount = row.securityAlerts?.length ?? 0;
                return (
                  <tr key={row.date} className={weekend ? 'daily-row--weekend' : ''}>
                    {/* Date */}
                    <td>
                      <div className="daily-cell-date">
                        <span className="daily-cell-date-main">{fmtDate(row.date)}</span>
                        <span className={`daily-cell-date-sub ${weekend ? 'daily-cell-date-sub--weekend' : ''}`}>
                          {fmtDay(row.date)}{weekend ? ' � Weekend' : ''}
                        </span>
                      </div>
                    </td>

                    {/* Footfall */}
                    <td>
                      <span className="daily-cell-footfall">{(row.totalFootfall ?? 0).toLocaleString()}</span>
                    </td>

                    {/* Male % */}
                    <td>
                      <div className="daily-cell-gender">
                        <span className="daily-cell-gender-val daily-cell-gender--male">
                          {row.malePercent != null ? `${row.malePercent.toFixed(1)}%` : ''}
                        </span>
                        {row.malePercent != null && (
                          <div className="daily-cell-gender-bar">
                            <div className="daily-cell-gender-fill" style={{ width: `${row.malePercent}%`, background: '#22D3EE' }} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Female % */}
                    <td>
                      <div className="daily-cell-gender">
                        <span className="daily-cell-gender-val daily-cell-gender--female">
                          {row.femalePercent != null ? `${row.femalePercent.toFixed(1)}%` : ''}
                        </span>
                        {row.femalePercent != null && (
                          <div className="daily-cell-gender-bar">
                            <div className="daily-cell-gender-fill" style={{ width: `${row.femalePercent}%`, background: '#F06068' }} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Peak Hour */}
                    <td>
                      <span className="daily-cell-peak">
                        <Clock size={9} />{row.peakHour || ''}
                      </span>
                    </td>

                    {/* Cashier Alerts */}
                    <td>
                      {cashierCount === 0 ? (
                        <span className="daily-alert-none"><CheckCircle size={11} />None</span>
                      ) : (
                        <button
                          className="daily-alert-btn daily-alert-btn--cashier"
                          onClick={() => setPopup({ type: 'cashier', date: row.date, alerts: row.cashierAlerts || [] })}
                        >
                          <AlertTriangle size={10} />
                          {cashierCount} alert{cashierCount !== 1 ? 's' : ''}
                        </button>
                      )}
                    </td>

                    {/* Security Alerts */}
                    <td>
                      {securityCount === 0 ? (
                        <span className="daily-alert-none"><CheckCircle size={11} />None</span>
                      ) : (
                        <button
                          className="daily-alert-btn daily-alert-btn--security"
                          onClick={() => setPopup({ type: 'security', date: row.date, alerts: row.securityAlerts || [] })}
                        >
                          <AlertTriangle size={10} />
                          {securityCount} alert{securityCount !== 1 ? 's' : ''}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

/* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
   KPI CARD
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
const KpiCard = ({ variant, icon: Icon, label, value, sub }) => (
  <div className={`an-kpi an-kpi--${variant}`}>
    <div className="an-kpi__icon"><Icon size={20} /></div>
    <div className="an-kpi__body">
      <p className="an-kpi__label">{label}</p>
      <h3 className="an-kpi__val">{value}</h3>
      {sub && <p className="an-kpi__sub">{sub}</p>}
    </div>
  </div>
);

/* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
   SECTION HEADER
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
const SectionHead = ({ icon: Icon, label, badge, aside, style }) => (
  <div className="an-section-head" style={style}>
    <div className="section-label">
      <Icon size={12} />
      {label}
      {badge && <span className="an-section-badge">{badge}</span>}
    </div>
    {aside}
  </div>
);

/* PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
   MAIN ANALYTICS COMPONENT
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP */
export default function Analytics() {
  const [activeDate, setActiveDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [lastUpdated, setLast] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [dailyRows, setDailyRows] = useState([]);
  const [dailyRange, setDailyRange] = useState(30);

  /*  store selection (admin)  */
  const [stores, setStores] = useState([]);
  const [activeStore, setActiveStore] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  /*  fetch the list of stores  */
  const fetchStores = useCallback(async () => {
    setIsAdmin(getIsAdmin());
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/stores`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
      if (res.ok) {
        const json = await res.json();
        setStores(Array.isArray(json) ? json : []);
        if (Array.isArray(json) && json.length > 0) {
          setActiveStore(prev => prev || json[0].store_name);
        }
      }
    } catch (e) {
      console.error('Failed to fetch stores', e);
    }
  }, []);

  /*  fetch main analytics  */
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const storeParam = activeStore ? `&store=${encodeURIComponent(activeStore)}` : '';
      const res = await fetch(`${API_BASE}/api/analytics?date=${activeDate}${storeParam}`);
      const json = await res.json();
      const newData = transformApiData(json);
      if (silent) {
        setData(prev => JSON.stringify(prev) === JSON.stringify(newData) ? prev : newData);
      } else {
        setData(newData);
        setLast(new Date().toLocaleTimeString());
      }
      setToastMsg(null);
    } catch (e) {
      console.error(e);
      setData(prev => prev ?? EMPTY_DATA);
      setToastMsg(e.message || 'Unable to reach the analytics server.');
      if (!silent) setLast(new Date().toLocaleTimeString());
    }
    if (!silent) setLoading(false);
  }, [activeDate, activeStore]);

  /*  fetch daily summary  */
  const fetchDailySummary = useCallback(async () => {
    try {
      const storeParam = activeStore ? `&store=${encodeURIComponent(activeStore)}` : '';
      const res = await fetch(`${API_BASE}/api/analytics?date=${activeDate}${storeParam}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setDailyRows(transformDailyData(json));
    } catch (e) {
      console.warn('Daily summary fetch failed:', e.message);
    }
  }, [activeDate, activeStore]);

  /*  load stores once on mount  */
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  /*  (re)load analytics when date or store changes  */
  useEffect(() => {
    fetchData(false);
    fetchDailySummary();
    let id;
    if (activeDate === todayStr) id = setInterval(() => fetchData(true), 5000);
    return () => clearInterval(id);
  }, [activeDate, activeStore]);

  const formatDisplayDate = (str) => {
    if (!str) return '';
    return new Date(str + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  /*  loading state  */
  if (!data) return (
    <div className="an-loading">
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      <div className="an-loading__spinner" />
      <p>Loading analytics&</p>
    </div>
  );

  const isToday = activeDate === todayStr;
  const totalVisitors = data.zoneVisits.reduce((s, z) => s + z.total, 0);
  const pieData = data.zoneVisits.map(z => ({ ...z, value: z.total }));
  const visiblePieData = pieData.filter(d => d.value > 0);
  const visibleWdPieData = data.wdPieData.filter(d => d.value > 0);
  const filteredDailyRows = dailyRange === 7 ? dailyRows.slice(0, 7) : dailyRows;

  return (
    <div className="an-page">
      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      {/* PP HEADER PP */}
      <div className="an-header">
        <div className="an-header__left">
          <h1 className="an-title">Zone <span>Analytics</span></h1>
          <div className="an-sub">
            {activeStore && <span className="an-sub-store-tag">{activeStore}</span>}
            <span className="an-sub-date">{formatDisplayDate(activeDate)}</span>
            {isToday && (
              <span className="an-sub-live">
                <span className="live-dot" />Live
              </span>
            )}
            {lastUpdated && (
              <>
                <span className="an-sub-sep">�</span>
                <span>Updated {lastUpdated}</span>
              </>
            )}
            {loading && <span className="spinner" style={{ marginLeft: 4 }} />}
          </div>
        </div>

        <div className="an-controls">
          {(isAdmin || stores.length > 1) && (
            <div className="store-wrap">
              <Store size={13} className="store-wrap__icon" />
              <select
                className="store-select"
                value={activeStore}
                onChange={e => setActiveStore(e.target.value)}
              >
                {stores.map(s => (
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
              onChange={e => { if (e.target.value) setActiveDate(e.target.value); }}
            />
          </div>
          <button className="btn-refresh" onClick={() => fetchData(false)} disabled={loading}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none', display: 'block' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* PP KPI ROW PP */}
      <div className="an-kpi-row">
        <KpiCard
          variant="teal"
          icon={Users}
          label="Total Visitors"
          value={data.totalVisitorsToday.toLocaleString()}
          sub={``}
        />
        <KpiCard
          variant="amber"
          icon={TrendingUp}
          label="Peak Zone"
          value={
            <span>
              {data.peakZone.zone}
              {data.peakZone.count > 0 && (
                <span style={{ fontSize: '0.6em', opacity: 0.55, marginLeft: 8, fontWeight: 400 }}>
                  {data.peakZone.count.toLocaleString()} visits
                </span>
              )}
            </span>
          }
        />
        <KpiCard
          variant="violet"
          icon={Flame}
          label="Busiest Day This Week"
          value={
            <span>
              {data.busiestDay.day}
              {data.busiestDay.count > 0 && (
                <span style={{ fontSize: '0.6em', opacity: 0.55, marginLeft: 8, fontWeight: 400 }}>
                  {data.busiestDay.count.toLocaleString()} visits
                </span>
              )}
            </span>
          }
         
        />
      </div>

      {/* PP CHARTS GRID PP */}
      <div className="an-charts-grid">

        {/* Zone Distribution */}
        <div className="an-chart-card">
          <div className="an-chart-card__head">
            <div>
              <h3 className="an-chart-card__title">Zone Distribution</h3>
              <p className="an-chart-card__sub">Footfall share by zone</p>
            </div>
            <span className="badge badge--teal">Footfall %</span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={visiblePieData} cx="50%" cy="50%"
                innerRadius="32%" outerRadius="74%"
                paddingAngle={visiblePieData.length > 1 ? 2 : 0}
                startAngle={90} endAngle={-270}
                dataKey="value" stroke="none"
                label={renderPieLabel} labelLine={false}
              >
                {visiblePieData.map(entry => <Cell key={entry.zone} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pie-legend" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 12 }}>
            {pieData.map(z => (
              <div key={z.zone} className="pie-legend-item">
                <span className="pie-legend-dot" style={{ background: z.fill }} />
                <span className="pie-legend-label">{z.zone}:</span>
                <span className="pie-legend-val">{z.total.toLocaleString()}</span>
                <span className="pie-legend-pct">
                  {totalVisitors > 0 ? ((z.total / totalVisitors) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekday vs Weekend */}
        <div className="an-chart-card">
          <div className="an-chart-card__head">
            <div>
              <h3 className="an-chart-card__title">Weekday vs Weekend</h3>
              <p className="an-chart-card__sub">Traffic pattern split</p>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              <span className="badge badge--violet">Weekday</span>
              <span className="badge badge--teal">Weekend</span>
            </div>
          </div>

          <div className="wd-split-layout">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={visibleWdPieData} cx="50%" cy="50%"
                  innerRadius="32%" outerRadius="80%"
                  paddingAngle={visibleWdPieData.length > 1 ? 3 : 0}
                  startAngle={90} endAngle={-270}
                  dataKey="value" stroke="none"
                  label={renderPieLabel} labelLine={false}
                >
                  {visibleWdPieData.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="wd-stat-col">
              {data.wdPieData.map(d => (
                <div key={d.name} className="wd-stat-item">
                  <span className="wd-stat-label" style={{ color: d.fill }}>{d.name}</span>
                  <span className="wd-stat-val" style={{ color: d.fill }}>{d.value.toLocaleString()}</span>
                  <div className="wd-bar-track">
                    <div className="wd-bar-fill" style={{
                      background: d.fill,
                      width: `${data.wdGrandTotal > 0 ? ((d.value / data.wdGrandTotal) * 100).toFixed(1) : 0}%`,
                    }} />
                  </div>
                  <span className="wd-pct">
                    {data.wdGrandTotal > 0 ? ((d.value / data.wdGrandTotal) * 100).toFixed(1) : 0}% of total
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="divider-line" />
          <p className="an-chart-card__title" style={{ marginBottom: 10 }}>By Zone</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data.weekdayData} barCategoryGap="28%" barGap={3} margin={{ top: 2, right: 4, bottom: 0, left: -14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="zone" tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={false} />
              <Bar dataKey="weekday" fill={WEEKDAY_COLOR} radius={[4, 4, 0, 0]} name="Weekday" maxBarSize={26} />
              <Bar dataKey="weekend" fill={WEEKEND_COLOR} radius={[4, 4, 0, 0]} name="Weekend" maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Traffic by Zone */}
        {data.hourlyData.length > 0 && (
          <div className="an-chart-card an-chart-card--full">
            <div className="an-chart-card__head">
              <div>
                <h3 className="an-chart-card__title">Hourly Traffic by Zone</h3>
                <p className="an-chart-card__sub">Entry + exit counts per hour</p>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {data.zones.map((z, i) => (
                  <span key={z} className="badge" style={{ background: `${ZONE_COLORS[i % ZONE_COLORS.length]}14`, color: ZONE_COLORS[i % ZONE_COLORS.length] }}>
                    {z}
                  </span>
                ))}
              </div>
            </div>
            <div className="legend-row">
              {data.zones.map((z, i) => (
                <span key={z} className="legend-item">
                  <span className="legend-dot" style={{ background: ZONE_COLORS[i % ZONE_COLORS.length] }} />{z}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={data.hourlyData} margin={CHART_MARGIN_FULL}>
                <defs>
                  {data.zones.map((z, i) => (
                    <linearGradient key={z} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ZONE_COLORS[i % ZONE_COLORS.length]} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={ZONE_COLORS[i % ZONE_COLORS.length]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="hour" tick={TICK_STYLE} axisLine={false} tickLine={false} padding={XAXIS_PAD} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={YAXIS_DOMAIN} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 }} />
                {data.zones.map((z, i) => (
                  <Area
                    key={z} type="monotone" dataKey={z}
                    stroke={ZONE_COLORS[i % ZONE_COLORS.length]} strokeWidth={1.8}
                    fill={`url(#grad-${i})`} name={z} dot={false} connectNulls
                    activeDot={{ r: 4, fill: ZONE_COLORS[i % ZONE_COLORS.length], stroke: '#060B18', strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Total Traffic Trend */}
        {data.hourlyData.length > 0 && (
          <div className="an-chart-card an-chart-card--full">
            <div className="an-chart-card__head">
              <div>
                <h3 className="an-chart-card__title">Total Traffic by Hour</h3>
                <p className="an-chart-card__sub">Combined footfall across all zones</p>
              </div>
              <span className="badge badge--teal">Trend Line</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data.hourlyData} margin={CHART_MARGIN_FULL}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="hour" tick={TICK_STYLE} axisLine={false} tickLine={false} padding={XAXIS_PAD} />
                <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} domain={YAXIS_DOMAIN} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 }} />
                <Line
                  type="monotone" dataKey="total" stroke="#00C896" strokeWidth={2.2}
                  name="Total" connectNulls
                  dot={{ r: 3, fill: '#00C896', stroke: '#060B18', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#00C896', stroke: '#060B18', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* PP DAILY BREAKDOWN PP */}
      <SectionHead
        icon={Calendar}
        label="Daily Breakdown"
        badge={dailyRange === 7 ? 'Last 7 Days' : 'Last 30 Days'}
        style={{ marginTop: 36 }}
        aside={
          <div style={{ display: 'flex', gap: 4 }}>
            {[7, 30].map(r => (
              <button
                key={r}
                onClick={() => setDailyRange(r)}
                className={`range-toggle-btn ${dailyRange === r ? 'range-toggle-btn--active' : ''}`}
              >
                {r}d
              </button>
            ))}
          </div>
        }
      />

      <p className="daily-help-text an-chart-card__title">
        Click any alert count to see the full breakdown.
      </p>

      <DailyBreakdownTable dailyRows={filteredDailyRows} />
    </div>
  );
}