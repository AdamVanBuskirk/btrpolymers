import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getSettings } from "../../Store/Settings";
import CustomerListTab from "./CustomerListTab";
import { getCompany, getMembers } from "../../Store/Company";
import DocsTab from "../DocsTab";

function Lists() {

    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const settingsState = useAppSelector(getSettings);
    const settings = settingsState.settings;

    /* This is just in case the members changed or is not loaded when they click on lists tab. I noticed 
       on Mari's screen owner in the list view said undefined undefined. This makes me think since the
       comapny had been loaded, she invited / added a member, but the array never updated. This is an
       inefficient fix, but for now should prevent this. Herdr bug H67. */
    useEffect(() => {
        const company = companyState.company;
        if (company) {
          dispatch(getMembers(company._id));
        }
    }, []);

    //const loadedSubComponent = settings.loadedSubComponentType;
    const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];

    return (
        <div className="rightContentDefault" style={{ height: "calc(100vh - 103.16px)" /* override for 53.16px for nav and 50px for sub nav height */ }}>
            <div style={{ width: "100%", height: "100%", margin: "0px auto", overflowY: "auto" }}>
                {loadedSubComponent === "customer" &&
                    <CustomerListTab />
                }
                {loadedSubComponent === "product" &&
                    <DocsTab />
                }
            </div>
        </div>
    );
}

export default Lists;