import {Box} from "@shopify/polaris";
import AdminOrderCard from "./admin-order-card";
import {useEffect, useMemo, useState} from "react";
import DateRangePicker from "../common/date-range-picker";
import type {IActiveDates} from "../layout/type";
import {default30Days} from "../../utils/default30Days";
import {BASE_URL} from "../../config";
import useDebounce from "../../hooks/debounce";
import type {CampaignListType} from "../store/type.ts";
import {CampaignsListsForAdmin} from "./campaigns-list.tsx";

const Orders = () => {
    // const [orders, setOrders] = useState<any>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<any>({});
    const [page, setPage] = useState<number>(1);
    const [filters, setFilters] = useState<string>("all");
    // @ts-ignore
    const [queryValue, setQueryValue] = useState("");
    const [campaigns, setCampaigns] = useState<CampaignListType>([] as CampaignListType);
    const searchTerm = useDebounce(queryValue, 700);

    const defaultActiveDates = useMemo(() => default30Days(), []);
    const [activeDates, setActiveDates] =
        useState<IActiveDates>(defaultActiveDates);

    const {period} = activeDates || {};
    const startDate = period
        ? new Date(period?.since).toISOString()
        : null//new Date().toISOString();
    const endDate = period
        ? new Date(
            new Date(period?.until).setDate(new Date(period.until).getDate() + 1)
        ).toISOString()
        : null //new Date().toISOString();

    useEffect(() => {
        setLoading(true);
        fetch(
            `${BASE_URL}/api/admin-campaigns?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=50&filter=${filters}&searchTerm=${searchTerm}`
        )
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setCampaigns(res.data ?? []);
                setPagination(res.pagination);
                // setStore(res.store);
                // setOrders(res.orders);
                // setPackageProtection(res.packageProtection);
                setStats(res.stats);
                // setPagination(res.pagination);
                setLoading(false);
            })
            .catch((err) => {
                // setOrders([]);
                setPagination({});
                setStats({
                    totalCampaigns: 0,
                    totalActiveCampaigns: 0,
                    totalInactiveCampaigns: 0,
                    totalScheduleCampaigns: 0,
                    totalDraftCampaigns: 0,
                    totalOthersCampaigns: 0,
                });
                setLoading(false);

                console.error("Error fetching subscriber data:", err);
            });
    }, [startDate, endDate, page, filters, searchTerm]);

    useEffect(() => {
        setPage(1);
    }, [filters, searchTerm, startDate, endDate]);

    return (
        <div className="p-6">
            <AdminOrderCard stats={stats}/>
            <br/>
            <Box paddingBlockEnd={"400"}>
                <div className="flex justify-between">
                    <DateRangePicker setActiveDates={setActiveDates}/>
                </div>
            </Box>

            <CampaignsListsForAdmin campaigns={campaigns} pagination={pagination} setFilters={setFilters}
                                    setPage={setPage} loading={loading} setLoading={setLoading}/>
            {/*<SubscriberOrderList*/}
            {/*  orders={orders}*/}
            {/*  pagination={pagination}*/}
            {/*  withStoreName={true}*/}
            {/*  loading={loading}*/}
            {/*  setPage={setPage}*/}
            {/*  page={page}*/}
            {/*  setFilters={setFilters}*/}
            {/*  setQueryValue={setQueryValue}*/}
            {/*  queryValue={queryValue}*/}
            {/*/>*/}
        </div>
    );
};

export default Orders;
