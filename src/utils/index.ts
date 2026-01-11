export function truncate(str: string, maxLength = 20) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export const handleIdCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    window.alert("announcement bar ID copied.");
  });
};
