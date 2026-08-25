import LogLevelBadge from "./LogLevelBadge";

function LogResultTable({ logs }) {
  return (
    <div className="table-container">
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
          {logs.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="empty-state"
              >
                No logs found for the selected
                filters.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="timestamp">
                  {log.timestamp}
                </td>

                <td>
                  <LogLevelBadge
                    level={log.level}
                  />
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
                        ? "response-time slow"
                        : "response-time"
                    }
                  >
                    {log.responseTime} ms
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LogResultTable;
