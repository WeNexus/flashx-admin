import { useEffect, useState } from "react";
import { SearchBar } from "../common/Log-search-bar";
import { LoggerTable } from "../common/Log-table";

export default function Logger() {
  const [searchParams, setSearchParams] = useState<any>({
    pageSize: 20,
    currentPage: 1,
  });

  const [logs, setLogs] = useState<Record<any, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  console.log(loading);
  const abrortController = new AbortController();

  // 🔄 Fetch data whenever searchParams change
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);

      const query = new URLSearchParams();

      if (searchParams.store) query.set("store", searchParams.store);
      if (searchParams.trackingId)
        query.set("trackingId", searchParams.trackingId);
      if (searchParams.pageSize)
        query.set("pageSize", searchParams.pageSize.toString());
      if (searchParams.currentPage)
        query.set("currentPage", searchParams.currentPage.toString());
      console.log("Built query string:", query.toString());
      if (searchParams.level) {
        query.set("level", searchParams.level);
      }
      try {
        const data = await fetch(
          `https://sales-discounts.wenexus.io/api/logs?${query.toString()}`,
          {
            signal: abrortController.signal,
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!data.ok) {
          throw new Error(`HTTP error! status: ${data.status}`);
        }
        const response = await data.json();
        setLogs(response.logs || []);
        setTotalCount(response.totalCount || 0);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [searchParams]);

  // ✅ Update handlers
  const handleSearch = (searchItem: {
    storeId: string;
    trackingId: string;
    level: string;
  }) => {
    setSearchParams((prev: any) => ({
      ...prev,
      store: searchItem.storeId,
      trackingId: searchItem.trackingId,
      level: searchItem.level,
      currentPage: 1, // Reset to first page on new search
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev: any) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  return (
    <div className="p-6 max-w-[85%] mx-auto">
      <SearchBar
        trackingId={searchParams.trackingId}
        storeId={searchParams.store}
        onSearch={handleSearch}
      />
      <LoggerTable
        logs={logs}
        currentPage={searchParams.currentPage}
        totalPages={
          searchParams.pageSize
            ? Math.ceil(totalCount / searchParams.pageSize)
            : 0
        }
        onPageChange={handlePageChange}
        pageLoading={loading}
      />
    </div>
  );
}
