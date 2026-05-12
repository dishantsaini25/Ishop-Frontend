import { fetchColors } from "@/api/api-call";
import ColorList from "./ColorList";


export default async function ByColor() {
  const { colors = [] } = (await fetchColors({ status: true })) || {};
  // Only show colors that have at least 1 product
  const filtered = colors.filter(c => (c.productCount || 0) > 0);
  return <ColorList colors={filtered} />;
}
