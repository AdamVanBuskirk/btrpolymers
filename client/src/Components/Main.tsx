import { useAppSelector } from '../Core/hooks';
import { getCompany } from '../Store/Company';

function Main() {

    const companyState = useAppSelector(getCompany);

    return (
        <div style={{ height: "90vh", width: "100%", backgroundColor: "#fff", borderBottomRightRadius: "20px",
            padding: "10px 15px"
         }}>
            <div style={{ width: "100%", margin: "0px auto", textAlign: "center" }}>
                {!companyState.company &&
                    <div style={{ paddingTop: "200px", fontStyle: "italic", fontSize: "18pt", fontWeight: "300", color: "#555" }}>
                        Loading...
                    </div>
                }
            </div>
        </div>
    );
}

export default Main;