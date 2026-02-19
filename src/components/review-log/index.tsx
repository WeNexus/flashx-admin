import moment from "moment";
import {useCallback, useEffect, useState} from "react";
import {ChevronDownIcon, ChevronRightIcon} from "@shopify/polaris-icons";
import {Icon} from "@shopify/polaris";
import {BASE_URL} from "../../config";

export default function ReviewActivityTable() {
    const [parents, setParents] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(20); // number of rows per page
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    /** 🔹 Fetch paginated data */
    const fetchData = useCallback(async () => {

        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/review-loader?page=${page}&limit=${limit}`
            );
            const json = await res.json();

            // In your current backend, if pagination isn’t built in,
            // you can simulate it here manually:
            const allParents = json.parents || [];
            const start = (page - 1) * limit;
            const paginated = allParents.slice(start, start + limit);

            setParents(paginated);
            setTotalPages(Math.ceil(allParents.length / limit));
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="p-6">
            <h1 className="text-[50px] font-semibold mb-4">Review Activity Overview</h1>

            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
                {loading ? (
                    <div className="text-center p-6 text-gray-500">Loading...</div>
                ) : (
                    <table className="min-w-full border-gray-200 border-collapse text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-left">
                            <th className="p-3 font-medium text-gray-700">Store</th>
                            <th className="p-3 font-medium text-gray-700">Email</th>
                            <th className="p-3 font-medium text-gray-700">
                                Initial Banner Review
                            </th>
                            <th className="p-3 font-medium text-gray-700">Banner Clicked</th>
                            <th className="p-3 font-medium text-gray-700">Banner Views</th>
                            <th className="p-3 font-medium text-gray-700">Visibility</th>
                            <th className="p-3 font-medium text-gray-700">Last Showed At</th>
                            <th className="p-3 font-medium text-gray-700">
                                Feedback Message
                            </th>
                            <th className="p-3 font-medium text-gray-700 w-10"></th>
                        </tr>
                        </thead>

                        <tbody>
                        {parents.map((parent) => {
                            const isOpen = expanded === parent.storeId;
                            return (
                                <>
                                    <tr
                                        key={parent.storeId}
                                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            setExpanded(isOpen ? null : parent.storeId)
                                        }
                                    >
                                        <td className="p-3 font-medium text-gray-800">
                                            <p>{parent.Store.name}</p>
                                            <a href={`https://${parent.Store.domain}`}
                                               className="text-xs text-green-600" target="_blank">
                                                {parent.Store.domain}
                                            </a>
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {parent.merchantEmail || "N/A"}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {parent.initialBannerReview ?? "N/A"}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {parent.firstBannerClickCount ?? 0}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {parent.bannerViews ?? 0}
                                        </td>
                                        <td className="p-3">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                parent.reviewVisibilityStatus === "Show"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {parent.reviewVisibilityStatus}
                        </span>
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {moment(parent.lastShowedAt).format(
                                                "MM/DD/YYYY hh:mm:ss A"
                                            )}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {parent.feedbackMessage || "N/A"}
                                        </td>
                                        <td className="p-3 text-right">
                                            <Icon
                                                source={
                                                    isOpen ? ChevronDownIcon : ChevronRightIcon
                                                }
                                                tone="base"
                                            />
                                        </td>
                                    </tr>

                                    {isOpen && parent.ReviewLogs.length > 0 && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={9} className="p-3">
                                                <div className="border border-gray-200 rounded-lg p-3 bg-white">
                                                    <h3 className="font-semibold text-gray-800 mb-2">
                                                        Review Logs
                                                    </h3>
                                                    <table className="w-full text-sm border-gray-200 border-collapse">
                                                        <thead>
                                                        <tr className="border-b border-gray-200 text-gray-600">
                                                            <th className="p-2 text-left">⭐ Rating</th>
                                                            <th className="p-2 text-left">Feedback</th>
                                                            <th className="p-2 text-left">Created At</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {parent.ReviewLogs.map((log: any) => (
                                                            <tr key={log.id} className="border-b border-gray-200">
                                                                <td className="p-2 text-gray-800">
                                                                    {log.initialBannerReview ?? "N/A"}
                                                                </td>
                                                                <td className="p-2 text-gray-600">
                                                                    {log.feedbackMessage || "N/A"}
                                                                </td>
                                                                <td className="p-2 text-gray-500">
                                                                    {moment(log.createdAt).fromNow()} (
                                                                    {moment(log.createdAt).format(
                                                                        "MM/DD/YYYY hh:mm:ss A"
                                                                    )}
                                                                    )
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {!loading && (
                    <div className="flex justify-between items-center p-3 border-t border-gray-200 bg-gray-50">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                            ← Previous
                        </button>

                        <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
