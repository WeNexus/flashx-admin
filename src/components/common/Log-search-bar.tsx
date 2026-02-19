import { Select, TextField } from "@shopify/polaris";
import { useState } from "react";

interface SearchBarProps {
  storeId: string | null;
  trackingId: string | null;
  onSearch: ({
    storeId,
    trackingId,
    level,
  }: {
    storeId: string;
    trackingId: string;
    level: string;
  }) => void;
}

export function SearchBar(options: SearchBarProps) {
  const { onSearch, storeId: storeid, trackingId: trackingid } = options;

  const [storeId, setStoreId] = useState(storeid ?? "");
  const [trackingId, setTrackingId] = useState(trackingid ?? "");
  const [selected, setSelected] = useState("");

  const handleSearch = () => {
    onSearch({ storeId, trackingId, level: selected });
  };

  return (
    <div className="md:flex md:items-end md:space-x-4 my-4">
      <div className="mb-4 md:mb-0">
        <TextField
          label="Store name or domain"
          value={storeId}
          onChange={setStoreId}
          autoComplete="off"
        />
      </div>
      <div className="mb-4 md:mb-0">
        <TextField
          label="Tracking ID"
          value={trackingId}
          onChange={setTrackingId}
          autoComplete="off"
        />
      </div>

      <div className="mb-4 md:mb-0">
        <Select
          label="Level"
          options={[
            { value: "", label: "" },
            { value: "INFO", label: "INFO" },
            { value: "WARN", label: "WARN" },
            { value: "ERROR", label: "ERROR" },
          ]}
          onChange={(value: string) => {
            setSelected(value);
          }}
          value={selected}
        />
      </div>

      <div className="flex items-end h-full gap-2">
        {/*<Button onClick={handleSearch}>Search</Button>*/}
        <button
          className={`bg-white text-black p-[5px]  w-[100px] rounded-lg border-[1px] border-gray-600 hover:bg-gray-600 hover:text-stone-50`}
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className={`bg-white text-black p-[5px]  w-[100px] rounded-lg border-[1px] border-gray-600 hover:bg-gray-600 hover:text-stone-50`}
          onClick={handleSearch}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
