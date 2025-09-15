import { useEffect, useState } from "react";
import "./App.css";

const items = [
  {
    avatar: "https://i.pravatar.cc/40?img=1",
    title: "Randall Johnsson",
    subtitle: "Active now",
    tab: "people",
  },
  {
    icon: "fa-regular fa-folder",
    title: "Random Michal Folder",
    subtitle: "in Photos • Edited 12m ago",
    badge: "12 Files",
    tab: "files",
  },
  {
    icon: "fa-regular fa-image",
    title: "crative_file_frandkies.jpg",
    subtitle: "in Photos/Assets • Edited 12m ago",
    tab: "files",
  },
  {
    avatar: "https://i.pravatar.cc/40?img=2",
    title: "Kristinge Karand",
    subtitle: "Active 2d ago",
    tab: "people",
  },
  {
    icon: "fa-regular fa-file-video",
    title: "files_krande_michelle.avi",
    subtitle: "in Videos • Added 12m ago",
    tab: "files",
  },
];

/* Skeleton Loader */
const SkeletonItem = () => (
  <div className="list-item">
    <div className="skeleton skeleton-avatar"></div>
    <div className="skeleton-text">
      <div className="skeleton skeleton-line title"></div>
      <div className="skeleton skeleton-line subtitle"></div>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [searching, setSearching] = useState(false); // controls skeletons
  const [filters, setFilters] = useState({
    all: true,
    files: true,
    people: true,
    chats: false,
    lists: true,
  });

  const tabs = [
    { key: "files", label: "Files", count: 6, icon: "fa-solid fa-paperclip" },
    { key: "people", label: "People", count: 3, icon: "fa-regular fa-user" },
    { key: "chats", label: "Chats", count: 0, icon: "fa-solid fa-comment" },
    { key: "lists", label: "Lists", count: 0, icon: "fa-solid fa-list" },
  ];

  const ListItem = ({ icon, title, subtitle, badge, avatar }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      const textToCopy = `${title} - ${subtitle}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);

        // Hide "Copied!" after 1.5s
        setTimeout(() => setCopied(false), 1500);
      });
    };

    return (
      <div className="list-container">
        <div className="list-item">
          {avatar ? (
            <img src={avatar} alt={title} className="avatar" />
          ) : (
            <i className={`${icon} file-icon`}></i>
          )}
          <div
            className="list-content"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <div className="list-title">
                <span dangerouslySetInnerHTML={{ __html: title }} />
                {badge && <span className="badge">{badge}</span>}
              </div>
              <div className="list-subtitle">{subtitle}</div>
            </div>
            <div onClick={handleCopy} style={{ cursor: "pointer" }}>
              <i className="fa-solid fa-copy"></i>
              {copied && (
                <span
                  style={{
                    position: "absolute",
                    background: "#4caf50",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toggleFilter = (key) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  // Debounced search + skeleton loading
  useEffect(() => {
    if (!search.trim()) {
      setFiltered([]);
      setSearching(false);
      return;
    }

    // Step 1: wait for debounce (500ms after typing stops)
    const debounceTimer = setTimeout(() => {
      setSearching(true); // show skeletons

      // Step 2: show skeletons for 1s, then load results
      const loaderTimer = setTimeout(() => {
        const lower = search.toLowerCase();

        let results = items.filter(
          (item) =>
            item.title.toLowerCase().includes(lower) ||
            item.subtitle.toLowerCase().includes(lower)
        );

        // Apply active tab + filters
        results =
          activeTab === "All"
            ? results.filter((item) => filters[item.tab])
            : results.filter(
                (item) => item.tab === activeTab && filters[item.tab]
              );

        setFiltered(results);
        setSearching(false); // hide skeletons, show results
      }, 1000);

      return () => clearTimeout(loaderTimer);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, activeTab, filters]);

  return (
    <div className="search-tabs">
      {/* Search bar */}
      <div className="search-header">
        <div className="container">
          <div className="search-bar">
            <div className="left">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Searching is easier"
              />
            </div>
            {search.trim() === "" ? (
              <div className="shortcut">
                <span className="key">S</span>
                <span className="label">quick access</span>
              </div>
            ) : (
              <div
                className="cancel"
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => {
                  setSearch("");
                  setFiltered([]);
                  setSearching(false);
                }}
              >
                Cancel
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="menu">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={`menu-item ${filters[tab.key] ? "" : "disabled"}`}
              >
                <div>
                  <i style={{ color: "#999999" }} className={`${tab.icon}`} />
                  <span style={{ marginLeft: "10px" }}>{tab.label}</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={filters[tab.key]}
                    onChange={() => toggleFilter(tab.key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs + Results */}
      {search.trim() !== "" && (
        <>
          {/* Tabs */}
          <div className="tabs">
            <div
              className={`tab ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              All <span className="count">10</span>
            </div>
            {tabs.map(
              (tab) =>
                filters[tab.key] && (
                  <div
                    key={tab.key}
                    className={`tab ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label} <span className="count">{tab.count}</span>
                  </div>
                )
            )}
            <div className="settings" onClick={() => setMenuOpen(!menuOpen)}>
              <i className="fa-solid fa-gear"></i>
            </div>
          </div>

          {/* Results */}
          <div className="results">
            <div className="list-container">
              {searching ? (
                [...Array(5)].map((_, i) => <SkeletonItem key={i} />)
              ) : filtered.length > 0 ? (
                filtered.map((item, i) => <ListItem key={i} {...item} />)
              ) : (
                <p className="no-results">No results found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
