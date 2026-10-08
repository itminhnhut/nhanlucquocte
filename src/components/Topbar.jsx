import appConfig from "../configs/appConfig";

function Topbar() {
  return (
    <div className="bg-gradient-to-r from-primary-dark to-primary text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 py-1.5 hidden md:flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6zm0 8.5A2.5 2.5 0 1110 5a2.5 2.5 0 010 5.5z" />
            </svg>
            {appConfig.address}
          </span>
          <a
            href={`tel:${appConfig.phoneE164}`}
            className="text-blue-100 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.3 3.3c-.4-1 0-1.7 1-2l3-.8c.9-.2 1.6.3 1.9 1.1l1.1 2.7c.3.8.1 1.7-.5 2.3L7.7 8.7c1 2.1 2.8 4 4.9 5.1l2.1-1.1c.7-.4 1.6-.4 2.3-.1l2.7 1.1c.8.3 1.3 1 1.1 1.9l-.8 3c-.2 1-.9 1.4-2 1-9-3.1-14-8.9-17.7-17.3z" />
            </svg>
            {appConfig.phone}
          </a>
        </div>
        <a
          href={appConfig.zalo}
          target="_blank"
          rel="noopener"
          className="w-8 h-8 rounded-full bg-[#0068ff] flex items-center justify-center text-[11px] font-bold border-2 border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
        >
          Zalo
        </a>
      </div>
    </div>
  );
}

export default Topbar;
