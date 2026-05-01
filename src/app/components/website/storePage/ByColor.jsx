import { fetchColors } from "@/api/api-call";
import ColorList from "./ColorList";


export default async function ByColor() {

const { colors = [] } = (await fetchColors({ status: true })) || {};

  

  return <ColorList colors={colors} />;
}
