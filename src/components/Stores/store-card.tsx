import { Icon, Text } from "@shopify/polaris";
import {
  ClockIcon, MegaphoneFilledIcon,
  StatusActiveIcon, StoreIcon,
} from "@shopify/polaris-icons";
import { useMemo, type ReactNode } from "react";

import type { IStats } from "./type";

const StoresCarts = ({ stats }: { stats: IStats }) => {
  const dashboardCartItems: {
    title: string;
    value: number | string;
    bg?: string;
    icon: ReactNode;
  }[] = useMemo(() => {
    return [
      {
        title: "Total Installed Stores",
        value: stats.totalInstalled,//stats?.totalStore ?? 0,
        bg: "#ffffff",
        icon: (
          <div className="bg-blue-400 p-3 rounded text-white">
            <Icon source={StoreIcon} />
          </div>
        ),
        // icon:<img width='70' src='https://shipguard.nyc3.cdn.digitaloceanspaces.com/ShipGuard%20Widget%20Assets/assets/order-image.png' alt='order-image'/>
      },
      {
        title: "Total Active Stores",
        value: stats.currentInstalled, //stats?.totalActive ?? 0,
        bg: "#cff1cf",
        icon: (
          <div className="bg-green-500 p-3 rounded text-white">
            <Icon source={StatusActiveIcon} />
          </div>
        ),
      },

      {
        title: "Total Standard subscriptions",
        value: stats.totalStandard, //stats?.totalInactive ?? 0,
        bg: "#ffd2e9",
        icon: (
          <div className="bg-gray-500 p-3 rounded text-white">
            <Icon source={MegaphoneFilledIcon} />
          </div>
        ),
      },
      {
        title: "Total Plus subscriptions",
        value: stats.totalPlus, // stats?.trial ?? 0,
        bg: "#b4fed2",
        icon: (
          <div className="bg-gray-500 p-3 rounded text-white">
            <Icon source={StatusActiveIcon} />
          </div>
        ),
      },
      {
        title: "Total Enterprise subscriptions",
        value: stats.totalEnterprise, // stats?.trial ?? 0,
        bg: "#d5ebff",
        icon: (
            <div className="bg-gray-500  p-3 rounded text-white">
              <Icon source={ClockIcon} />
            </div>
        ),
      },
    ];
  }, [stats]);
  return (
    <div className="grid grid-cols-2  md:grid-cols-5 gap-2 md:gap-4 gap-y-4 ">
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
  );
};

export default StoresCarts;
