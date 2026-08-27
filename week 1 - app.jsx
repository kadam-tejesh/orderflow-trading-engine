import { useMemo, useState } from "react";
import "./App.css";

const logs = [
  {
    id: 1,
    timestamp: "2026-08-17 14:58:42",
    level: "ERROR",
    service: "payment-service",
    message: "Payment gateway connection failed",
    responseTime: 1250,
  },
  {
    id: 2,
    timestamp: "2026-08-17 14:58:40",
    level: "INFO",
    service: "auth-service",
    message: "User authentication successful",
    responseTime: 120,
  },
  {
    id: 3,
    timestamp: "2026-08-17 14:58:37",
    level: "WARN",
    service: "billing-api",
    message: "Response time exceeded expected limit",
    responseTime: 850,
  },
  {
    id: 4,
    timestamp: "2026-08-17 14:58:34",
    level: "DEBUG",
    service: "auth-service",
    message: "JWT token validation completed",
    responseTime: 45,
  },
  {
    id: 5,
    timestamp: "2026-08-17 14:58:30",
    level: "INFO",
    service: "payment-service",
    message: "Payment request received",
    responseTime: 210,
  },
  {
    id: 6,
    timestamp: "2026-08-17 14:58:26",
    level: "ERROR",
    service: "billing-api",
    message: "Database connection timeout",
    responseTime: 2100,
  },
  {
    id: 7,
    timestamp: "2026-08-17 14:58:22",
    level: "INFO",
    service: "notification-service",
    message: "Email notification sent successfully",
    responseTime: 180,
  },
  {
    id: 8,
    timestamp: "2026-08-17 14:58:18",
    level: "WARN",
    service: "payment-service",
    message: "Retrying payment request",
    responseTime: 920,
  },
  {
    id: 9,
    timestamp: "2026-08-17 14:58:14",
    level: "DEBUG",
    service: "billing-api",
    message: "SQL query executed successfully",
    responseTime: 65,
  },
  {
    id: 10,
    timestamp: "2026-08-17 14:58:10",
    level: "INFO",
    service: "auth-service",
    message: "Session created for user",
    responseTime: 95,
  },
];

function LogLevelBadge({ level }) {
  return (
    <span className={`level-badge ${level.toLowerCase()}`}>
      {level}
    </span>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div className="filter-group">
      <label>{label}</label>

      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "ALL" ? `All ${label}s` : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function LogResultTable({ data }) {
  return (
    <div className="table-wrapper">
      <table className="log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Level</th>
            <th>Service</th>
            <th>Message</th>
            <th>Response Time</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((log) => (
              <tr key={log.id}>
                <td className="timestamp">{log.timestamp}</td>

                <td>
                  <LogLevelBadge level={log.level} />
                </td>

                <td>
                  <span className="service-name">
                    {log.service}
                  </span>
                </td>

                <td className="message">
                  {log.message}
                </td>

                <td>
                  <span
                    className={
                      log.responseTime > 1000
                        ? "response slow"
                        : "response"
                    }
                  >
                    {log.responseTime} ms
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-state">
                No logs found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");

  const services = [
    "ALL",
    ...new Set(logs.map((log) => log.service)),
  ];

  const levels = [
    "ALL",
    "INFO",
    "WARN",
    "ERROR",
    "DEBUG",
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const serviceMatches =
        serviceFilter === "ALL" ||
        log.service === serviceFilter;

      const levelMatches =
        levelFilter === "ALL" ||
        log.level === levelFilter;

      return serviceMatches && levelMatches;
    });
  }, [serviceFilter, levelFilter]);

  const clearFilters = () => {
    setServiceFilter("ALL");
    setLevelFilter("ALL");
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>LogStream</h1>
          <p>Distributed Log Analytics Dashboard</p>
        </div>

        <div className="live-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      {/* Dashboard */}
      <main className="dashboard">

        <div className="page-title">
          <div>
            <h2>Log Results</h2>
            <p>
              Search, filter and monitor application logs
            </p>
          </div>

          <div className="result-count">
            {filteredLogs.length} results
          </div>
        </div>

        {/* Filters */}
        <section className="filter-panel">

          <div className="filter-heading">
            <span className="filter-icon">☰</span>
            Filters
          </div>

          <div className="filters">

            <FilterDropdown
              label="Service Name"
              value={serviceFilter}
              options={services}
              onChange={setServiceFilter}
            />

            <FilterDropdown
              label="Log Level"
              value={levelFilter}
              options={levels}
              onChange={setLevelFilter}
            />

            <button
              className="clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        </section>

        {/* Table */}
        <section className="logs-card">

          <div className="table-header">
            <div>
              <h3>Application Logs</h3>
              <span>
                Showing {filteredLogs.length} log entries
              </span>
            </div>

            <div className="refresh">
              ● Live Data
            </div>
          </div>

          <LogResultTable data={filteredLogs} />

        </section>

      </main>

      <footer>
        LogStream Analytics Dashboard • Week 1 UI Components
      </footer>

    </div>
  );
}

export default App;
