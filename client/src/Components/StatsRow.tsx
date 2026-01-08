import { useIsMobile } from '../Core/hooks';

function StatsRow() {

    const isMobile = useIsMobile();

    return (
        <div className="client-stats" style={{ marginTop: "60px" }}>
            <div className="client-stat">
                <div style={{ fontSize: "80px", fontWeight: 950 }}>7.9K</div>
                <div>CUSTOMER TOUCHES</div>
            </div>
            <div className="client-stat">
                <div style={{ fontSize: "80px", fontWeight: 950 }}>$22M</div>
                <div>NEW OPPORTUNITIES</div>
            </div>
            <div className="client-stat">
                <div style={{ fontSize: "80px", fontWeight: 950 }}>$8M</div>
                <div>CLOSED REVENUE</div>
            </div>
            <div className="client-stat">
                <div style={{ fontSize: "80px", fontWeight: 950 }}>28%</div>
                <div>REVENUE GROWTH</div>
            </div>
        </div>
    );
}

export default StatsRow;