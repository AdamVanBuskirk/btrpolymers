import { useIsMobile } from '../../Core/hooks';
import DesktopDash from '../../Components/Desktop/Dash';
import MobileDash from '../../Components/Mobile/Dash';

function Dash() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileDash  /> : <DesktopDash />;
}

export default Dash;