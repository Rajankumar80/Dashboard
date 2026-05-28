
// import React from 'react';
// import { Activity, Home, BarChart2, Settings, Menu, X, Video, Camera } from 'lucide-react';
// import './Sidebar.css';

// const NAV_ITEMS = [
//   { icon: Home,      label: 'Dashboard'      },
//   { icon: BarChart2, label: 'Analytics'      },
//   { icon: Video,     label: 'Live Streaming' },
//   { icon: Camera,    label: 'Cameras'        },
//   { icon: Settings,  label: 'Store Settings' },
// ];

// export default function Sidebar({ activePage, setActivePage, expanded, setExpanded }) {
//   return (
//     <aside className={`sidebar ${expanded ? 'sidebar--open' : 'sidebar--closed'}`}>

//       {/* ── Top: brand + hamburger ── */}
//       <div className="sidebar__head">
//         <div className={`sidebar__brand ${expanded ? 'sidebar__brand--visible' : 'sidebar__brand--hidden'}`}>
//           <div className="brand-icon">
//             <Activity size={16} strokeWidth={2.5} />
//           </div>
//           <span className="brand-name">Store AI</span>
//         </div>

//         <button
//           className={`hamburger ${!expanded ? 'hamburger--center' : ''}`}
//           onClick={() => setExpanded(!expanded)}
//           aria-label="Toggle sidebar"
//           title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
//         >
//           {expanded
//             ? <X size={16} strokeWidth={2.5} />
//             : <Menu size={16} strokeWidth={2.5} />
//           }
//         </button>
//       </div>

//       {/* ── Nav ── */}
//       <nav className="sidebar__nav">
//         {NAV_ITEMS.map(({ icon: Icon, label }) => {
//           const isActive = activePage === label;
//           return (
//             <button
//               key={label}
//               className={`nav-btn ${isActive ? 'nav-btn--active' : ''} ${expanded ? '' : 'nav-btn--icon-only'}`}
//               onClick={() => setActivePage(label)}
//               title={!expanded ? label : undefined}
//             >
//               {isActive && <span className="nav-btn__indicator" />}
//               <span className="nav-btn__icon-wrap">
//                 <Icon size={18} strokeWidth={2} />
//               </span>
//               {expanded && <span className="nav-btn__label">{label}</span>}
//             </button>
//           );
//         })}
//       </nav>

//       {/* ── Footer ── */}
//       <div className="sidebar__foot">
//         <div className="pulse-dot" />
//         {expanded && <span className="sidebar__foot-label">Live data</span>}
//       </div>
//     </aside>
//   );
// }

import React from 'react';
import { Activity, Home, BarChart2, Settings, Menu, X, LogOut, Video } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Video, label: 'Live Streams' },
  { icon: Settings, label: 'Store Settings' },
  { icon: Video, label: 'Camera' },
  
];

export default function Sidebar({ activePage, setActivePage, expanded, setExpanded }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('store_name');
    localStorage.removeItem('user_email');
    window.location.href = '/login';
  };

  const userEmail = localStorage.getItem('user_email') || 'user@example.com';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const displayName = userEmail.split('@')[0];

  return (
    <aside className={`sidebar ${expanded ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar__head">
        <div className={`sidebar__brand ${expanded ? 'sidebar__brand--visible' : 'sidebar__brand--hidden'}`}>
          <div className="brand-icon">
            <Activity size={16} strokeWidth={2.5} />
          </div>
          <span className="brand-name">Store AI</span>
        </div>
        <button
          className={`hamburger ${!expanded ? 'hamburger--center' : ''}`}
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle sidebar"
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = activePage === label;
          return (
            <button
              key={label}
              className={`nav-btn ${isActive ? 'nav-btn--active' : ''} ${expanded ? '' : 'nav-btn--icon-only'}`}
              onClick={() => setActivePage(label)}
              title={!expanded ? label : undefined}
            >
              {isActive && <span className="nav-btn__indicator" />}
              <span className="nav-btn__icon-wrap">
                <Icon size={18} strokeWidth={2} />
              </span>
              {expanded && <span className="nav-btn__label">{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar__foot">
        <div className={`user-section ${expanded ? 'user-section--expanded' : 'user-section--collapsed'}`}>
          <div className="user-profile" title={userEmail}>
            <div className="user-avatar">
              {userInitial}
            </div>
            {expanded && <span className="user-name">{displayName}</span>}
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-btn__icon">
              <LogOut size={16} strokeWidth={2} />
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}