import { Icon, Text } from "@shopify/polaris";
import {
  ClockIcon, MegaphoneFilledIcon,
  StatusActiveIcon,
} from "@shopify/polaris-icons";
import { type ReactNode } from "react";

const AdminOrderCard = ({ stats }: { stats: any }) => {


  const dashboardCartItems: {
    title: string;
    value: number | string;
    bg?: string;
    icon: ReactNode;
  }[] = [

    {
      title: "Total Campaigns",
      value: stats.totalCampaigns ?? 0, //stats?.totalInactive ?? 0,
      bg: "#F3F4F6",
      icon: (
          <div className="bg-gray-500 p-3 rounded text-white">
            <Icon source={MegaphoneFilledIcon} />
          </div>
      ),
    },
    {
      title: "Total Active Campaigns",
      value: stats.totalActiveCampaigns  ?? 0, // stats?.trial ?? 0,
      bg: "#DCFCE7",
      icon: (
          <div className="bg-gray-500 p-3 rounded text-white">
            <Icon source={StatusActiveIcon} />
          </div>
      ),
    },

    {
      title: "Total Scheduled Campaigns",
      value: stats.totalScheduleCampaigns  ?? 0, // stats?.trial ?? 0,
      bg: "#DBEAFE",
      icon: (
          <div className="bg-gray-500  p-3 rounded text-white">
            <Icon source={ClockIcon} />
          </div>
      ),
    },
    {
      title: "Total Draft Campaigns",
      value: stats.totalDraftCampaigns  ?? 0, // stats?.trial ?? 0,
      bg: "#F1F5F9",
      icon: (
          <div className="bg-gray-500  p-3 rounded text-white">
            <Icon source={ClockIcon} />
          </div>
      ),
    },
    {
      title: "Total Stuck or Cancelled Campaigns",
      value: stats.totalOthersCampaigns  ?? 0, // stats?.trial ?? 0,
      bg: "#FEF3C7",
      icon: (
          <div className="bg-gray-500  p-3 rounded text-white">
            <Icon source={ClockIcon} />
          </div>
      ),
    }
  ];
  return (
    <>
      <div className="grid grid-cols-2  md:grid-cols-4 gap-2 md:gap-4 gap-y-4 ">
        {" "}
        {dashboardCartItems.map((e, i) => (
          <div className="col-span-1 h-full" key={i}>
            <div
              className={`flex justify-between items-center gap-2 border rounded-lg  shadow p-4 h-full`}
              style={{ background: e.bg }}
            >
              <div className="flex flex-col sm:items-start items-center justify-between gap-2 h-full w-full">
                <div className="block sm:hidden ">{e.icon}</div>
                <Text as="span" fontWeight="medium">
                  {e.title}
                </Text>
                <span
                  className={`font-semibold text-2xl sm:text-4xl ${
                    i === 1 ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  {e.value}
                </span>
              </div>
              <div className="hidden sm:block">{e.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminOrderCard;
