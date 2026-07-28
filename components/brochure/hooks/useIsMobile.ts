import { MOBILE_MAX } from "../constants";
import { useHasMounted } from "./useHasMounted";
import { useViewportSize } from "./useViewportSize";

export function useIsMobile() {
  const mounted = useHasMounted();
  const { width } = useViewportSize();
  return mounted && width <= MOBILE_MAX;
}
