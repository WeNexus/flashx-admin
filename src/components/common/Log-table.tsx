import { Pagination } from "@shopify/polaris";

interface TableProps {
  logs: Record<string, any>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (currentPage: number) => void;
  pageLoading?: boolean;
}

export function LoggerTable(options: TableProps) {
  const { logs, currentPage, totalPages, onPageChange, pageLoading } = options;
  return (
    <div className="border rounded mb-6 overflow-x-auto">
      <div className="hidden sm:block">
        <table className="min-w-full text-left text-sm font-light">
          {/* Desktop Table */}

          <thead>
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Store</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Tracking ID</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 &&
              !pageLoading &&
              logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {/*<span>{log.storeId}</span>*/}
                    {/*<br/>*/}
                    <span>{log.storeName}</span>
                    <br />
                    <span>{log.storeDomain}</span>
                  </td>
                  <td
                    className={`px-4 py-2 ${
                      log.level !== "INFO" ? "text-red-600" : ""
                    }`}
                  >
                    {log.level}
                  </td>
                  <td className="px-4 py-2">{log.trackingId}</td>
                  <td className="px-4 py-2">{log.message}</td>
                  <td className="px-4 py-2">
                    {log.metadata ? (
                      <details>
                        <summary>View</summary>
                        <pre className="text-xs whitespace-pre-wrap h-[200px] overflow-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="sm:hidden space-y-4 p-4">
        {!pageLoading &&
          logs.map((log) => (
            <div key={log.id} className="border rounded p-4 shadow-sm">
              <div className="mb-2">
                <span className="font-semibold">Timestamp:</span>
                <div>{new Date(log.timestamp).toLocaleString()}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Store:</span>
                <div>{log.storeName}</div>
                <div className="text-gray-500 text-sm">{log.storeDomain}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Level:</span>
                <div className={log.level !== "INFO" ? "text-red-600" : ""}>
                  {log.level}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Tracking ID:</span>
                <div>{log.trackingId}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Message:</span>
                <div>{log.message}</div>
              </div>
              <div>
                <span className="font-semibold">Metadata:</span>
                <div>
                  {log.metadata ? (
                    <details>
                      <summary className="text-blue-600 underline cursor-pointer">
                        View
                      </summary>
                      <pre className="text-xs whitespace-pre-wrap max-h-[200px] overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {pageLoading ? (
        <div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
          <p className="text-center text-gray-500">Loading logs...</p>
        </div>
      ) : (
        logs.length === 0 && (
          <div className="flex items-center justify-center h-full py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mt-4 text-xl font-semibold text-gray-700">
                No Data Available
              </h2>

              <p className="mt-2 text-gray-500">
                We couldn’t find any items that match your search.{" "}
                <br className="hidden sm:block" />
                Try adjusting your keywords or filters.
              </p>
            </div>
          </div>
        )
      )}
      {/* Pagination */}
      <div className="flex justify-center gap-3 sticky bottom-0 items-center  p-4 border-t bg-gray-100">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Pagination
          hasPrevious={currentPage > 1}
          onPrevious={() => onPageChange(currentPage - 1)}
          hasNext={currentPage < totalPages}
          onNext={() => onPageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
}
