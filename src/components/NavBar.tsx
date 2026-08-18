import { Link, useLocation } from "react-router-dom";

const TABS = [
  {
    to: "/",
    label: "Home",
    match: (path: string) => path === "/",
    icon: (active: boolean) => (
      <path
        d="M5 12l7-7 7 7M7 10.5V19a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-8.5"
        fill="none"
        stroke={active ? "#C9A66B" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: "/learn",
    label: "Learn",
    match: (path: string) => path.startsWith("/learn"),
    icon: (active: boolean) => (
      <path
        d="M4 6.5C4 5.7 4.7 5 5.5 5H11a2 2 0 0 1 2 2v12a1.5 1.5 0 0 0-1.5-1.5H4.5A.5.5 0 0 1 4 17V6.5ZM20 6.5c0-.8-.7-1.5-1.5-1.5H13a2 2 0 0 0-2 2v12a1.5 1.5 0 0 1 1.5-1.5h5.5a.5.5 0 0 0 .5-.5V6.5Z"
        fill="none"
        stroke={active ? "#C9A66B" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: "/brew",
    label: "Brew",
    match: (path: string) => path === "/brew" || path.startsWith("/recipe/"),
    icon: (active: boolean) => (
      <>
        <path
          d="M5 9h11l-1.2 8.5A2 2 0 0 1 12.8 19H8.2a2 2 0 0 1-2-1.5L5 9Z"
          fill="none"
          stroke={active ? "#C9A66B" : "currentColor"}
          strokeWidth="1.8"
        />
        <path
          d="M16 10.5c2 0 3 1.3 3 3s-1 3-3 3"
          fill="none"
          stroke={active ? "#C9A66B" : "currentColor"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    to: "/spots",
    label: "Spots",
    match: (path: string) => path.startsWith("/spots"),
    icon: (active: boolean) => (
      <path
        d="M12 21s-7-6.1-7-11.2A7 7 0 0 1 19 9.8C19 14.9 12 21 12 21Z M12 12.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"
        fillRule="evenodd"
        fill="none"
        stroke={active ? "#C9A66B" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-husk/10 bg-char/90 backdrop-blur"
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active = tab.match(location.pathname);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-husk/40"
              aria-current={active ? "page" : undefined}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                {tab.icon(active)}
              </svg>
              <span
                className={`text-[11px] font-medium ${active ? "text-roast-light" : "text-husk/40"}`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
