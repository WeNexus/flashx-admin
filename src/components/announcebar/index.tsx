import { useEffect, useState } from "react";
import useDebounce from "../../hooks/debounce";
import { BASE_URL } from "../../config";
import {
  Badge,
  Icon,
  IndexFilters,
  IndexTable,
  LegacyCard,
  Spinner,
  Text,
  useIndexResourceState,
  useSetIndexFiltersMode,
  type TabProps,
} from "@shopify/polaris";
import { Link } from "react-router";
import { ClipboardIcon } from "@shopify/polaris-icons";
import { truncate } from "../../utils";

const AnnounceBar = () => {
  const [data, setSubscribers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<string>("all");
  const [queryValue, setQueryValue] = useState("");
  const [reFetch] = useState<boolean>(false);

  const searchTerm = useDebounce(queryValue, 700);

  const [itemStrings] = useState(["All", "Active", "Inactive"]);

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data);

  useEffect(() => {
    if (selected === 0) {
      setFilters("all");
    } else if (selected === 1) {
      setFilters("active");
    } else {
      setFilters("inactive");
    }
  }, [selected]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${BASE_URL}/admin/announce-bar?page=${page}&limit=50&filter=${filters}&searchTerm=${searchTerm}`
    )
      .then((res) => res.json())
      .then((res) => {
        setSubscribers(res?.data ?? []);
        setPagination(res?.pagination ?? {});
      })
      .catch((err) => {
        console.error("List fetch error:", err);
        setSubscribers([]);
        setPagination({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filters, searchTerm, reFetch]);

  useEffect(() => {
    setPage(1);
  }, [filters, searchTerm]);

  const handleIdCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      window.alert("announcement bar ID copied.");
    });
  };

  const rowMarkup = data?.map((item, index) => {
    const {
      id,
      name,
      announceBarType,
      barPosition,
      status,
      Store,
      Campaign,
      createdAt,
    } = item;
    return (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <div className="flex flex-col items-baseline gap-1">
            <span className="font-semibold text-blue-600 underline">
              {name}
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleIdCopy(item.id);
              }}
              className="cursor-pointer text-gray-500 flex gap-2"
            >
              ID: {truncate(id, 16)} <Icon source={ClipboardIcon} />
            </span>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell className="capitalize">
          <Link
            target="_blank"
            to={`https://${Store.domain}`}
            className="text-blue-700"
          >
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {Store.name}
            </Text>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell className="capitalize">
          {announceBarType
            .replaceAll("_", " ")
            .replace(/\bANNOUNCEMENTS?\b/g, "")
            .replace(/\s{2,}/g, " ")
            .toLocaleLowerCase()}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {barPosition
            .replaceAll("_", " ")
            .replace("PAGE", "")
            .toLocaleLowerCase()}
        </IndexTable.Cell>
        <IndexTable.Cell>{Campaign?.name ?? "Not Connected"}</IndexTable.Cell>
        <IndexTable.Cell className="capitalize">
          {" "}
          <Badge
            tone={
              status === "ACTIVE"
                ? "success"
                : status === "INACTIVE"
                ? "critical"
                : "info"
            }
          >
            {item.status.toLowerCase()}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{createdAt}</IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <div className="p-6">
      {" "}
      <LegacyCard>
        <IndexFilters
          sortOptions={[]}
          queryValue={queryValue}
          queryPlaceholder="Searching in Store Name"
          onQueryChange={(value: string) => setQueryValue(value)}
          onQueryClear={() => setQueryValue("")}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          filters={[]}
          onClearAll={() => setQueryValue("")}
          cancelAction={{
            onAction: () => {},
            disabled: false,
            loading: false,
          }}
          mode={mode}
          setMode={setMode}
          loading={loading}
        />
        <IndexTable
          condensed={false}
          itemCount={data.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Name" },
            { title: "Store Name" },
            { title: "Type" },
            { title: "Placement" },
            { title: "Connect Campaigns" },
            { title: "Status" },

            { title: "Created At" },
          ]}
          pagination={{
            hasPrevious: pagination?.hasPrevPage,
            label: (
              <>
                {page} / {pagination?.totalPages}
              </>
            ),
            hasNext: pagination?.hasNextPage,
            onNext: () => setPage((prev: number) => prev + 1),
            onPrevious: () => setPage((prev: number) => prev - 1),
          }}
          selectable={false}
        >
          {loading ? (
            <IndexTable.Row id={"loading"} position={1}>
              <IndexTable.Cell colSpan={12}>
                <div className="flex justify-center">
                  <Spinner accessibilityLabel="Loading..." size="large" />
                </div>
              </IndexTable.Cell>
            </IndexTable.Row>
          ) : (
            <>{rowMarkup}</>
          )}
        </IndexTable>
      </LegacyCard>
    </div>
  );
};

export default AnnounceBar;
