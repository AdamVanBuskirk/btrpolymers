import { useIsMobile } from '../Core/hooks';

function CompanyRow() {

    const isMobile = useIsMobile();

    return (
        <div className="client-logos" style={{ marginTop: isMobile ? "0px" : "60px" }}>
            <div className="client-item">
                <img src='/images/customer-logo-1.png' style={{ height: "150px" }} />
            </div>
            <div className="client-item">
                <img src='/images/customer-logo-2.png' style={{ height: "150px"  }} />
            </div>
            <div className="client-item">
                <img src='/images/customer-logo-3.png' style={{ height: "150px"  }} />
            </div>
            <div className="client-item">
                <img src='/images/customer-logo-4.png' style={{ height: "150px"  }} />
            </div>
            <div className="client-item">
                <img src='/images/customer-logo-5.png' style={{ height: "150px"  }} />
            </div>
        </div>
    );
}

export default CompanyRow;