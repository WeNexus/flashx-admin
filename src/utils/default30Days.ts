export const default30Days = () => {
  const until = new Date();          // now
  const since = new Date(until);     // copy of 'until'

  // Go back 30 days
  since.setDate(since.getDate() - 30);
  // Start of that day (00:00:00.000)
  since.setHours(0, 0, 0, 0);

  return {
    title: "Last 30 days",
    alias: "last_30_days",
    period: {
      since: since.toISOString(),
      until: until.toISOString(),
    },
  };
};
