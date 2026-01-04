import StoresCarts from "./store-card.tsx";
import StoresList from "./stores-list.tsx";
import useDebounce from "../../hooks/debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../config";
import type { IStats, StoreRecordList } from "./type";

const initialStats: IStats = {
  currentInstalled: 0,
  totalInstalled: 0,
  totalUninstalled: 0,
  totalStandard: 0,
  totalPlus: 0,
  totalEnterprise: 0,
};

const Stores = () => {
  const [data, setSubscribers] = useState<StoreRecordList>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [stats, setStats] = useState<IStats>(initialStats);
  const [filters, setFilters] = useState<string>("all");
  const [queryValue, setQueryValue] = useState("");
  const [reFetch, setReFetch] = useState<boolean>(false);

  // Debounce search input so we don't fetch on every keystroke
  const searchTerm = useDebounce(queryValue, 700);

  // Guards: ensure only the latest request can update state
  const listReqIdRef = useRef(0);

  // ---- Fetch Subscribers (list) ----
  useEffect(() => {
    const controller = new AbortController();
    const myReqId = ++listReqIdRef.current;

    // Build URL safely

    setLoading(true);

    fetch(
      `${BASE_URL}/admin/dashboard?page=${page}&limit=50&filter=${filters}&searchTerm=${searchTerm}`,
      {
        signal: controller.signal,
        // include CORS mode if needed; not required in most setups
        // mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // <-- enable if your API needs cookies
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // Ignore if a newer request has started since this one
        if (myReqId !== listReqIdRef.current) return;
        setSubscribers(res?.data ?? []);
        setPagination(res?.pagination ?? {});
      })
      .catch((err) => {
        if (controller.signal.aborted) return; // expected on cleanup
        console.error("List fetch error:", err);
        if (myReqId !== listReqIdRef.current) return;
        setSubscribers([]);
        setPagination({});
      })
      .finally(() => {
        if (myReqId === listReqIdRef.current) {
          setLoading(false);
        }
      });

    // Cancel on dependency change/unmount so stale requests don't race
    return () => controller.abort();
  }, [page, filters, searchTerm, reFetch]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm]);

  // ---- Fetch Metrics (summary) ----
  const fetchMetrics = useCallback(() => {
    const controller = new AbortController();

    fetch(`${BASE_URL}/api/app-summary`, {
      signal: controller.signal,
      // mode: "cors",
      headers: { "Content-Type": "application/json" },
      method: "GET",
      // credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => setStats(res ?? initialStats))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Metrics fetch error:", err);
        setStats(initialStats);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const cleanup = fetchMetrics();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [fetchMetrics]);

  return (
    <div className="p-6">
      <StoresCarts stats={stats} />
      <br />
      <StoresList
        stores={data ?? []}
        pagination={pagination}
        loading={loading}
        setPage={setPage}
        page={page}
        setFilters={setFilters}
        setQueryValue={setQueryValue}
        queryValue={queryValue}
        setReFetch={setReFetch}
      />
    </div>
  );
};

export default Stores;
