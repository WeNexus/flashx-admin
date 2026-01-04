import {useEffect, useState} from "react";
import { useParams} from "react-router";
import {BASE_URL} from "../../config";
import type {CampaignListType} from "./type";
// import useDebounce from "../../hooks/debounce";
import {CampaignsLists} from "./campaigns-list.tsx";
import {Button} from "@shopify/polaris";
import {ArrowLeftIcon} from "@shopify/polaris-icons";
import CampaignsDetailsCart from "./stores-details-card.tsx";
import AppControlCard from "./app-control-card.tsx";

const Store = () => {
    const {storeId} = useParams<{ storeId: string }>();
    const [reFetch, setReFetch] = useState<boolean>(false);
    
    const [stats, setStats] = useState<{
        totalCampaigns: number,
        totalActiveCampaigns: number,
        totalInactiveCampaigns: number,
        totalScheduleCampaigns: number,
        totalDraftCampaigns: number,
        totalOthersCampaigns: number,
    }>(
        {
            totalCampaigns: 0,
            totalActiveCampaigns: 0,
            totalInactiveCampaigns: 0,
            totalScheduleCampaigns: 0,
            totalDraftCampaigns: 0,
            totalOthersCampaigns: 0,
        }
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<any>({});
    const [store, setStore] = useState<any>({});
    const [page, setPage] = useState<number>(1);

    const [filters, setFilters] = useState<string>("all");
    // ts-ignore
    // const [queryValue, setQueryValue] = useState("");
    // const searchTerm = useDebounce(queryValue, 700);


    const [campaigns, setCampaigns] = useState<CampaignListType>([] as CampaignListType);
    const [jobs, setJobs] = useState<any>([]);

    console.log("STORE:", loading,);

    useEffect(() => {
        fetch(
            `${BASE_URL}/api/admin-campaignsbystore?storeId=${storeId}&page=${page}&limit=50&filter=${filters}` //&searchTerm=${searchTerm
        )
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                debugger
                setCampaigns(filters != 'jobs' ? res.data ?? [] : []);
               setJobs(filters == 'jobs' ? res.data ?? [] : []);
                setPagination(res.pagination);
                setStore(res.store);
                // setOrders(res.orders);
                // setPackageProtection(res.packageProtection);
                setStats(res.stats);
                // setPagination(res.pagination);
                // setLoading(false);
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
    }, [storeId, page, filters, reFetch]);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    return (
        <div className="p-6">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        icon={ArrowLeftIcon}
                        onClick={() =>
                            (location.href = "/flashx-logs/#/stores/")
                        }
                    ></Button>{" "}
                    <span className="text-2xl font-bold">
           Campaigns Details
          </span>
                </div>
                {/*<div className="text-lg">*/}
                {/*  <span className="border px-2 py-1 rounded-lg shadow-sm">Plan</span>{" "}*/}
                {/*  <span className="bg-green-400 py-1 px-2 rounded-lg">Active</span>*/}
                {/*</div>*/}
            </div>
            <h2 className={`text-md font-medium mt-3`}>
                Store domain:{" "}
                <a className={'text-blue-500'} target={'_blank'} href={`https://${storeId}`}>{storeId}</a>
            </h2>

            <br/>
            <div className="grid gird-cols-2 md:grid-cols-6 lg:grid-cols-11 xl:grid-cols-7 gap-4 ">
                <div className="col-span-1 md:col-span-6 lg:col-span-7 xl:col-span-5">
                    <CampaignsDetailsCart
                        stats={stats}
                    />
                </div>
                <div className="col-span-1 md:col-span-6 lg:col-span-4 xl:col-span-2">
                  <AppControlCard
                    store={store}
                    setReFetch={setReFetch}
                  />
                </div>
            </div>
            <br/>
            <CampaignsLists campaigns={campaigns ?? []} pagination={pagination} setFilters={setFilters} jobs={jobs}/>
            {/*<SubscriberOrderList*/}
            {/*  orders={orders}*/}
            {/*  pagination={pagination}*/}
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

export default Store;
