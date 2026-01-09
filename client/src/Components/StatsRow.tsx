import { useIsMobile } from '../Core/hooks';

function StatsRow() {

    const isMobile = useIsMobile();

    return (
        <div className="client-stats" style={{ marginTop: "60px" }}>
            <div className="client-stat">
                <div>
                    <span style={{ fontSize: "80px", fontWeight: 950 }}>
                        300M
                    </span>
                    <span style={{ fontSize: "24px", paddingLeft: "10px" }}>
                        lb
                    </span>
                </div>
                <div>PROCESSED</div>
            </div>
            <div className="client-stat">
                <div>
                    <span style={{ fontSize: "80px", fontWeight: 950 }}>
                        3B
                    </span>
                    <span style={{ fontSize: "24px", paddingLeft: "10px" }}>
                        lb
                    </span>
                </div>
                <div>DIVERTED FROM LANDFILL</div>
            </div>
            <div className="client-stat">
            <div>
                    <span style={{ fontSize: "80px", fontWeight: 950 }}>
                        10B
                    </span>
                    <span style={{ fontSize: "24px", paddingLeft: "10px" }}>
                        gal
                    </span>
                </div>
                <div>OF WATER SAVED</div>
            </div>
            <div className="client-stat">
                <div>
                    <span style={{ fontSize: "80px", fontWeight: 950 }}>
                        100%
                    </span>
                </div>
                <div>POST-CONSUMER RESIN</div>
            </div>
        </div>
    );
}

export default StatsRow;