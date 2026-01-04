import {
    useSetIndexFiltersMode,
    useIndexResourceState,
    IndexFilters,
    IndexTable,
    LegacyCard,
    Spinner,
    Badge,
    Text,
} from "@shopify/polaris";
import type {TabProps} from "@shopify/polaris";
import {useState, useMemo, useEffect, type Dispatch, type SetStateAction} from "react";
import type {StoreRecordList} from "./type";
import {Link} from "react-router";

const StoresList = ({
                             stores,
                             loading,
                             pagination,
                             page = 1,
                             setPage ,
                             setFilters ,
                             setQueryValue ,
                             queryValue,
                         }: {
    stores: StoreRecordList;
    loading: boolean;
    pagination: Record<string, any>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    setFilters: Dispatch<SetStateAction<any>>;
    setQueryValue: Dispatch<SetStateAction<any>>;

    setReFetch: Dispatch<SetStateAction<any>>;
    queryValue: string;
}) => {
    const [itemStrings] = useState(["All", "Active", "Inactive"]);

    const tabs: TabProps[] = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => {
        },
        id: `${item}-${index}`,
        isLocked: index === 0,
    }));
    const [selected, setSelected] = useState(0);
    const {mode, setMode} = useSetIndexFiltersMode();

    useEffect(() => {
        if (selected === 0) {
            setFilters("all");
        } else if (selected === 1) {
            setFilters("active");
        } else {
            setFilters("inactive");
        }
    }, [selected, setFilters]);


    const storesStructure = useMemo(() => {
        return stores?.map((store) => {

            const norm = (s:string) => (s ?? "").toUpperCase();
            const campaigns = store?.Campaigns ?? [];

            const totalCampaigns = campaigns.length;

            const activeCampaigns = campaigns.filter(c => norm(c.status) === "ACTIVE").length;
            const inactiveCampaigns = campaigns.filter(c => norm(c.status) === "INACTIVE").length;

            const country = store.Timezone.Country.name;

            return {
                id: store.id,
                domain: store.domain,
                storeName: (
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {store.name}
                    </Text>
                ),
                plan: <Badge tone="critical">{"Free"}</Badge>,
                totalCampaigns: totalCampaigns,
                activeCampaign: activeCampaigns,
                inactiveCampaign: inactiveCampaigns,
                country: country,
                storePlan: store.plan,
                // status: (
                //   <SwitchButton
                //     switchOn={!store.development}
                //     handleSwitch={() =>
                //       handleStatusSwitch(store.id, !store.development)
                //     }
                //   />
                // ),
                appReview: store.appReview,
                createdAt: new Date(store.createdAt).toDateString(),
                uninstalledAt: store.uninstalledAt ? new Date(store.uninstalledAt).toDateString() : 'N/A',
            };
        });
    }, [stores]);

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(storesStructure);

    const rowMarkup = storesStructure?.map(
        (
            {
                id,
                domain,
                storeName,
                plan,
                totalCampaigns,
                activeCampaign,
                inactiveCampaign,
                country,
                storePlan,
                appReview,
                createdAt,
                uninstalledAt,
            },
            index
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Link to={`${domain}`} className="text-blue-700">
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                            {storeName}
                        </Text>
                    </Link>
                </IndexTable.Cell>
                <IndexTable.Cell>{plan}</IndexTable.Cell>
                <IndexTable.Cell>{totalCampaigns}</IndexTable.Cell>
                <IndexTable.Cell>{activeCampaign}</IndexTable.Cell>
                <IndexTable.Cell>{inactiveCampaign}</IndexTable.Cell>
                {/*<IndexTable.Cell>N/A</IndexTable.Cell>*/}
                <IndexTable.Cell>{storePlan}</IndexTable.Cell>
                <IndexTable.Cell>{country}</IndexTable.Cell>
                <IndexTable.Cell>{createdAt}</IndexTable.Cell>
                <IndexTable.Cell>{uninstalledAt}</IndexTable.Cell>
                <IndexTable.Cell>
                    <div
                    >
                        {appReview ? <span className={'bg-green-200 p-1 rounded'}>Reviewed</span> :
                            <span className={`bg-yellow-200 p-1 rounded`}>Not Reviewed</span>}

                    </div>
                </IndexTable.Cell>


                {/*<IndexTable.Cell>{totalOrders}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{totalProtectionOrders}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{totalUnprotectionOrders}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{revenue}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{insuranceEarning}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{conversionRate} % </IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{storePlan}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{country}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{createdAt}</IndexTable.Cell>*/}
                {/*<IndexTable.Cell>{status}</IndexTable.Cell>*/}
            </IndexTable.Row>
        )
    );

    return (
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
                    onAction: () => {
                    },
                    disabled: false,
                    loading: false,
                }}
                mode={mode}
                setMode={setMode}
                loading={loading}
            />
            <IndexTable
                condensed={false}
                itemCount={storesStructure.length}
                selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    {title: "Store Name"},
                    {title: "Plan"},
                    {title: "Total Campaigns"},
                    {title: "Active Campaigns"},
                    {title: "Inactive Campaigns"},
                    // {title: "Secured Revenue"},
                    {title: "Shopify Status"},
                    {title: "Country"},
                    {title: "Installed At"},
                    {title:"Uninstalled At"},
                    {title: "Review"},
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
                                <Spinner accessibilityLabel="Loading..." size="large"/>
                            </div>
                        </IndexTable.Cell>
                    </IndexTable.Row>
                ) : (
                    <>{rowMarkup}</>
                )}
            </IndexTable>
        </LegacyCard>
    );
};

export default StoresList;
