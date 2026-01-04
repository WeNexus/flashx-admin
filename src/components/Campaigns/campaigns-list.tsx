import {
    Badge,
    Button,
    Card,
    EmptyState,
    IndexFilters,
    IndexTable,
    type IndexTableProps,
    InlineStack,
    type TabProps,
    Tag,
    Text,
    useBreakpoints,
    useSetIndexFiltersMode,
} from "@shopify/polaris";

const createCampaign =
    "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png?width=150&height=150";

import {useCallback, useMemo, useState} from "react";

import type {CampaignListType} from "../store/type.ts";
import {PlusIcon} from "@shopify/polaris-icons";
import SpinnerComponent from "../store/utitls/spinner-component.tsx";
import {
    formatNumber,
    getCampaignStatusBadgeProps,
} from "../store/utitls/utils.ts";

export const CampaignsListsForAdmin = ({
                                           campaigns,
                                           setFilters,
                                           pricingBannerOff = true,
                                           pagination,
                                           setPage,
                                           loading,
                                           setLoading,
                                       }: {
    campaigns: CampaignListType;
    pagination: {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    setFilters: React.SetStateAction<any>;
    pricingBannerOff?: boolean;
    setPage: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<any>>;
}) => {
    const breakpoints = useBreakpoints();

    const {mode, setMode} = useSetIndexFiltersMode();


    const itemStrings = [
        "All",
        "Active",
        "Inactive",
        "Schedule",
        "Draft",
        "Pending",
    ];

    // Map selected tab to status value
    const statusMap: Record<any, any> = {
        0: undefined, // All
        1: "ACTIVE",
        2: "INACTIVE",
        3: "SCHEDULED",
        4: "DRAFT",
        5: "PENDING",
    };

    // Manage selected tab
    const [selected, setSelected] = useState(() => {
        switch (status) {
            case "active":
                return 1;
            case "Inactive":
                return 2;
            case "Schedule":
                return 3;
            case "draft":
                return 4;
            case "Pending":
                return 5;
            default:
                return 0;
        }
    });

    // Define tabs
    const tabs: TabProps[] = itemStrings.map((item, index) => ({
        content: item,
        id: String(index),
    }));

    // const defaultFormatter = useMemo(
    //     () =>
    //         new Intl.DateTimeFormat("en", {
    //             day: "numeric",
    //             year: "2-digit",
    //             month: "2-digit",
    //             hour: "numeric",
    //             minute: "numeric",
    //         }),
    //     [],
    // );

    console.log("campaigns", campaigns);

    const formatters = useMemo(() => {
        if (!campaigns) {
            return null;
        }

        // setPageLoading(false);

        const uniqueTimeZones = new Set(
            campaigns.map((campaign) => campaign.StartDateTimeZone.id),
        );

        const formatters: Record<string, Intl.DateTimeFormat> = {};

        for (const timeZone of uniqueTimeZones) {
            formatters[timeZone] = new Intl.DateTimeFormat("en", {
                day: "numeric",
                year: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                timeZoneName: "short",
                timeZone,
            });
        }

        return formatters;
    }, [campaigns]);

    const handleTabChange = useCallback((selectedIndex: number) => {
        // setPageLoading(true);

        if (selectedIndex >= 0 && selectedIndex < itemStrings.length) {
            const statusFromUser: string = statusMap[selectedIndex] ?? "all";

            const currentParams = new URLSearchParams(location.search);
            currentParams.set("status", statusFromUser.toLowerCase());
            // navigate(`${location.pathname}?${currentParams.toString()}`, {
            //     replace: true,
            // });

            setFilters(statusFromUser.toLowerCase());
            setSelected(selectedIndex);
        }
    }, [itemStrings.length, setFilters, statusMap]);

    const resourceName = useMemo(
        () => ({
            singular: "Campaign",
            plural: "Campaigns",
        }),
        [],
    );
    const headings = useMemo<IndexTableProps["headings"]>(
        () => [
            {
                title: "Discount Info",
                key: "name",
            },
            {
                title: "Store",
                key: "store",
            },
            {
                title: "Products",
                key: "products",
            },
            {
                title: "Schedule",
                key: "schedule",
            },
            {
                title: "Status",
                key: "status",
            },
            {
                title: "Actions",
                key: "actions",
            },
        ],
        [],
    );
    console.log("dfdf", pagination, loading);
    return (
        <div>
            {!pricingBannerOff && (
                <div>
                    <Card padding={"300"}>
                        <InlineStack align={"space-between"}>
                            <div>
                                <h4>Current Plan:</h4>
                                <h1 className={"font-bold"}>{"Free (Early Bird)"}</h1>
                            </div>

                            <div>
                                <h4>Total Product Variants:</h4>
                                <h1 className={"font-bold"}>
                                    {/*{pricingPlan?.storeTotalVariants ?? 0}*/} 100
                                </h1>
                            </div>

                            <div>
                                <h4>Active Discount:</h4>
                                <h1 className={"font-bold"}>
                                    {/*{`${pricingPlan?.totalVariantUsed ?? 0} / Unlimited`}*/}{" "}
                                    100
                                </h1>
                            </div>

                            <div>
                                <h4>Active Campaign:</h4>
                                <h1 className={"font-bold"}>
                                    10{" "}
                                    {/*{`${pricingPlan?.totalActiveCampaign ?? 0} / Unlimited`}*/}
                                </h1>
                            </div>
                        </InlineStack>
                    </Card>
                    <br/>
                </div>
            )}

            <Card padding="0">
                {/*{screenSize.width >= 800 && (*/}

                <div>
                    {/*{loading && (*/}
                    {/*    <div*/}
                    {/*        style={{*/}
                    {/*            position: 'absolute',*/}
                    {/*            top: '50%',*/}
                    {/*            left: '50%',*/}
                    {/*            transform: 'translate(-50%, -50%)',*/}
                    {/*            zIndex: 999,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <SpinnerComponent size={'large'}/>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {/*{campaigns.length == 0 && !loading ? undefined : (*/}
                        <IndexFilters
                            queryValue=""
                            queryPlaceholder="Search Campaigns"
                            onQueryChange={() => {
                            }}
                            onQueryClear={() => {
                            }}
                            tabs={tabs}
                            selected={selected}
                            onSelect={handleTabChange}
                            canCreateNewView={false}
                            mode={mode}
                            setMode={setMode}
                            hideQueryField={true}
                            hideFilters={true}
                            filters={[]}
                            onClearAll={() => {
                                throw new Error("Function not implemented.");
                            }}
                        />
                    {/*// )}*/}

                    <IndexTable
                        loading={loading}
                        // onSelectionChange={handleSelectionChange}
                        // promotedBulkActions={bulkActions}
                        condensed={breakpoints.smDown}
                        hasMoreItems={true}
                        resourceName={resourceName}
                        selectable={false}
                        // bulkActions={bulkActions}
                        headings={headings}
                        // loading={loading}
                        itemCount={campaigns.length}
                        pagination={{
                            hasPrevious: pagination?.hasPrevPage,
                            label: (
                                <span>
                  {/*Showing{' '}*/}
                                    {pagination.totalCount === 1 ? (
                                        `all ${campaigns.length}`
                                    ) : (
                                        <span>
                      {Math.min(
                          (pagination.page - 1) * pagination.perPage + 1,
                          pagination.totalCount,
                      )}{" "}
                                            -{" "}
                                            {Math.min(
                                                pagination.page * pagination.perPage,
                                                pagination.totalCount,
                                            )}{" "}
                                            of{" "}
                                            {Math.min(
                                                pagination.page * pagination.perPage,
                                                campaigns.length ?? 0,
                                            )}{" "}
                                            of {pagination.totalCount}
                    </span>
                                    )}{" "}
                                    Campaigns
                </span>
                            ),
                            hasNext: pagination?.hasNextPage,
                            onNext: () => setPage((prev: number) => prev + 1),
                            onPrevious: () => setPage((prev: number) => prev - 1),
                        }}
                        lastColumnSticky
                        emptyState={
                            loading ? (
                                <EmptyState
                                    image={createCampaign}
                                    heading={(<SpinnerComponent size="large"/>) as any}
                                ></EmptyState>
                            ) : loading ? (
                                <div className="mt-14">
                                    <SpinnerComponent size="large" key={"page-2"}/>
                                </div>
                            ) : (
                                campaigns.length === 0 &&
                                selected == 0 &&
                                !loading && (
                                    <EmptyState
                                        image={createCampaign}
                                        heading="Create your first Campaign"
                                        action={{
                                            url: "/sales-campaigns/create-campaign",
                                            content: "Create Campaign",
                                            icon: PlusIcon,
                                        }}
                                    >
                                        <Text as="p">
                                            You can create sales campaigns and manage discounts by
                                            products, collections, tags, or your entire store with a
                                            few clicks.
                                        </Text>
                                    </EmptyState>
                                )
                            )
                        }
                    >
                        {campaigns.map((campaign, i) => {
                            // const { collections, collectionLength } =
                            //     getCollectionTitle(campaign);



                            return (
                                <IndexTable.Row
                                    // selected={selectedResources.includes(campaign.id.toString())}
                                    id={campaign.id.toString()}
                                    key={campaign.id}
                                    rowType="data"
                                    position={i}
                                    onClick={() => {
                                        setLoading(true);
                                    }}
                                >
                                    <IndexTable.Cell className="padding12">
                                        <div className="parent flex items-center">
                                            <div className="w-[3rem] h-[3rem] ">
                                                <img
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "5px",
                                                        objectFit: "contain",
                                                    }}
                                                    src={
                                                        campaign.campaignImage ??
                                                        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
                                                    }
                                                    width={50}
                                                    height={50}
                                                    alt=""
                                                />
                                            </div>

                                            <div className="pl-5">
                                                <Text
                                                    as={"span"}
                                                    fontWeight="medium"
                                                    variant={"bodyMd"}
                                                >
                                                    {campaign.name}
                                                </Text>
                                                <p className="text-gray-500">
                                                    {" "}
                                                    {campaign?.maxDiscount == "Up to 0%"
                                                        ? ""
                                                        : campaign.maxDiscount + "off"}{" "}
                                                </p>
                                            </div>
                                        </div>
                                    </IndexTable.Cell>

                                    <IndexTable.Cell className="padding12">
                                        <div className="parent flex items-center">
                                            <Button
                                                onClick={() => {
                                                    if (window !== undefined) {
                                                        const base = window.location.origin;
                                                        window.location.href = `${base}/flashx-admin/#/stores/${campaign?.Store?.domain}`;
                                                    }
                                                }}
                                            >
                                                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                                {/*@ts-expect-error*/}
                                                <StoreStatusDisplay store={campaign?.Store}/>
                                            </Button>
                                        </div>
                                    </IndexTable.Cell>

                                    {/*Products*/}
                                    <IndexTable.Cell className="padding12">
                                        <div className="pt-2">
                                            {campaign.maxDiscount == "Up to 0%" ? (
                                                <Tag>No product selected</Tag>
                                            ) : (
                                                <Tag>
                                                    {
                                                        // campaign.totalSelectedProducts == 0 &&
                                                        // campaign.multipleSelection
                                                        //     ? 'Multiple selections'
                                                        //     : campaign.totalSelectedProducts > 1
                                                        //         ? 'Multiple selections'
                                                        //         :
                                                        "Individual selections"
                                                    }
                                                </Tag>
                                            )}

                                            <span
                                                className={`ml-1  rounded-md font-bold ${
                                                    campaign?.status == "Price_updating"
                                                        ? "bg-[#d5ebff] pt-1 pb-1 pr-2 pl-2"
                                                        : campaign.status == "Active" &&
                                                        campaign?.totalSelectedProducts.length != 0
                                                            ? "bg-[#b4fed2] pt-1 pb-1 pr-2 pl-2"
                                                            : `bg-[#e3e3e3] ${campaign?.totalSelectedProducts?.length != 0 && "pt-1 pb-1 pr-2 pl-2"}`
                                                }`}
                                            >
                        {["Filtering", "Processing"].includes(campaign.status)
                            ? undefined
                            : campaign?.totalSelectedProducts?.length == 0
                                ? null
                                : `${formatNumber(campaign?.totalSelectedProducts ?? 0)} Variants`}
                      </span>
                                        </div>
                                        <div className="pt-2">
                                            {campaign.overDiscountPriceItem > 0 &&
                                                campaign.status == "Active" && (
                                                    <Text as="p" tone={"caution"}>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // downloadProduct(
                                                                //     campaign.overDiscountPriceItem
                                                                // );
                                                            }}
                                                            className="underline text-blue-500 hover:text-blue-700"
                                                        >
                              <span className="mr-1">
                                {campaign.overDiscountPriceItem} variants
                              </span>
                                                        </a>
                                                        <span>over-discounted excluded from campaign</span>
                                                    </Text>
                                                )}
                                        </div>
                                    </IndexTable.Cell>

                                    <IndexTable.Cell className="text-center padding12">
                                        {campaign.status === "Scheduled" ? (
                                            <div className={"flex flex-col max-w-fit gap-1"}>
                                                <Badge
                                                    tone="info"
                                                    size="large"
                                                >{`Start at ${formatters ? formatters[campaign.startDateTimezoneId].format(new Date(campaign.startDate)) : campaign.startDate}`}</Badge>
                                                <Badge size="large">
                                                    {campaign.endDate
                                                        ? `Ended at ${formatters ? formatters[campaign.endDateTimezoneId].format(new Date(campaign.endDate)) : campaign.endDate}`
                                                        : `Never ends, unless manually ended`}
                                                </Badge>
                                            </div>
                                        ) : [
                                            "Active",
                                            "Filtering",
                                            "Processing",
                                            "Importing_products",
                                            "Price_updating",
                                        ].includes(campaign.status) ? (
                                            <div className={"flex flex-col max-w-fit gap-1"}>
                                                <Badge size="large" tone={"success"}>
                                                    {`Start at ${formatters ? formatters[campaign.startDateTimezoneId].format(new Date(campaign.startDate)) : campaign.startDate}`}
                                                </Badge>

                                                <Badge size="large">
                                                    {campaign.endDate
                                                        ? `Ended at ${formatters ? formatters[campaign.endDateTimezoneId].format(new Date(campaign.endDate)) : campaign.endDate}`
                                                        : `Never ends, unless manually ended`}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <div className={"flex flex-col max-w-fit gap-1"}>
                                                <Badge size="large">
                                                    {`Start at ${formatters ? formatters[campaign.startDateTimezoneId].format(new Date(campaign.startDate)) : campaign.startDate}`}
                                                </Badge>

                                                <Badge size="large">
                                                    {campaign.endDate
                                                        ? `Ended at ${formatters ? formatters[campaign.endDateTimezoneId].format(new Date(campaign.endDate)) : campaign.endDate}`
                                                        : `Never ends, unless manually ended`}
                                                </Badge>
                                            </div>
                                        )}
                                    </IndexTable.Cell>

                                    <IndexTable.Cell className="text-center padding12">
                                        <Badge
                                            {...getCampaignStatusBadgeProps(campaign.status as any)}
                                        />
                                    </IndexTable.Cell>

                                    <IndexTable.Cell>
                                        {/*  <CampaignActions*/}
                                        {/*    status={campaign.status}*/}
                                        {/*    onAction={(action) => {*/}
                                        {/*      if (action == 'edit') {*/}
                                        {/*        setPageLoading(true);*/}
                                        {/*      }*/}
                                        {/*      handleCampaignAction(campaign.id, action);*/}
                                        {/*    }}*/}
                                        {/*  />*/}
                                        <span>No action</span>
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            );
                        })}
                    </IndexTable>
                </div>
                {/*)}*/}
            </Card>
        </div>
    );
};

const StoreStatusDisplay = ({store}: {store: any}):any => {
    return (
        <span>
            {/* Provide a default name if store or name is missing */}
            {store?.name ?? "Store name"}

            <span className={"ml-1"}>
                {store?.uninstalledAt ? (
                    <Badge tone={"warning"}>Uninstalled</Badge>
                ) : (
                    <Badge tone={"success"}>Active</Badge>
                )}
            </span>
        </span>
    );
};