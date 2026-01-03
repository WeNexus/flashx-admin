import { createHashRouter } from "react-router";
import App from "./App";
import Orders from "./components/Campaigns";
import Layout from "./components/layout";
import Subscribers from "./components/subscribers";
import Subscriber from "./components/subscriber";
import Login from "./auth/login";
import ActivityLogs from "./components/userLogs";
import Settings from "./components/settings";
import Integrations from "./components/integrations";
import ReviewLogs from "./components/review-log";
import AnnounceBar from "./components/announcebar";

export const router = createHashRouter([
  {},
  { index: true, element: <App /> },
  { path: "login", element: <Login /> },
  {
    path: "campaigns",
    element: (
      <Layout>
        <Orders />
      </Layout>
    ),
  },
  {
    path: "subscribers",
    element: (
      <Layout>
        <Subscribers />
      </Layout>
    ),
  },
  {
    path: "announce-bar",
    element: (
      <Layout>
        <AnnounceBar />
      </Layout>
    ),
  },
  {
    path: "subscribers/:storeId",
    element: (
      <Layout>
        <Subscriber />
      </Layout>
    ),
  },
  {
    path: "subscribers/:storeId/:campaignId",
    element: (
      <Layout>
        <div>
          <h1>This is campaign page by campaign id</h1>
        </div>
      </Layout>
    ),
  },
  {
    path: "activity-logs",
    element: (
      <Layout>
        <ActivityLogs />
      </Layout>
    ),
  },
  {
    path: "review",
    element: (
      <Layout>
        <ReviewLogs />
      </Layout>
    ),
  },
  {
    path: "settings",
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
  {
    path: "integrations",
    element: (
      <Layout>
        <Integrations />
      </Layout>
    ),
  },

  {
    path: "*",
    element: <>Page Not Found!</>,
  },
]);
