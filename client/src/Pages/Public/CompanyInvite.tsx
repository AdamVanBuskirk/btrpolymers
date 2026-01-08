import React, { CSSProperties, useState } from 'react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../Core/hooks';
import { useParams } from 'react-router-dom';
import { getCompany, getCompanyPublic } from "../../Store/Company";
import Avatar from '../../Components/Avatar';
import { getUser, logout, logoutForInvite, setLoggedOutForInvite } from '../../Store/Auth';
import { getDevice } from '../../Helpers/getDevice';

function CompanyInvite() {

    const dispatch = useAppDispatch();
    const {company, link } = useParams();
    const companyState = useAppSelector(getCompany);
    const userState = useAppSelector(getUser);

    //const [fetched, setFetched] = useState(false);

    useEffect(() => {
      if (company && link) {
        dispatch(logoutForInvite());
        
      }
    }, [company, link]);

    useEffect(() => {
        if (company && link && userState.loggedOutForInvite) {
            dispatch(setLoggedOutForInvite(false));
            dispatch(getCompanyPublic({ companyId: company, link }));
        }
    }, [userState.loggedOutForInvite]);
    

    /*
    useEffect(() => {
      if (!company || !link || fetched) return;
      if (userState.status !== "idle" && userState.status !== "failed") return;
    
      const timer = setTimeout(() => {
        console.log("loading company public after logout");
        dispatch(getCompanyPublic({ companyId: company, link }));
      }, 1000);
    
      return () => clearTimeout(timer);
    }, [company, link, userState.status, fetched]);
*/

    if (company && companyState.inviteCompany) {

        let loginLink = process.env.REACT_APP_FRONTEND_URL + "/login/" + company + "/" + link;
        let registerLink = process.env.REACT_APP_FRONTEND_URL + "/register/" + company + "/" + link;

        return (
            <div className="pt-4 text-center">
                <div>
                    <img src="/images/sales-doing-logo.jpg" style={{ width: "300px" }} alt="SalesDoing" />    
                </div>
                <div style={{ fontSize: "18pt" }}>
                    <span>
                        &nbsp;Access&nbsp;
                    </span>
                    <span style={{ fontWeight: "bold" }}>
                        {companyState.inviteCompany.name}
                    </span>
                    <span>
                        &nbsp;to start using the SalesDoing platform.
                    </span>
                </div>
                <div style={{ textAlign: "center", marginTop: "15px", marginBottom: "35px" }}>
                    <a href={registerLink} className="inviteBtnOrange">
                        Sign Up
                    </a>
                    <a href={loginLink} className="inviteBtnGray">
                        Login
                    </a>
                </div>
            </div>
        );
    } else {
        // just to satisfy App that this component can't be undefined
        return (<div style={{ width: "100%", height: "100%", margin: "0px auto", color: "gray",
            fontSize: "18pt", textAlign: "center", paddingTop: "100px"
         }}>
            Loading Invite...
        </div>);
    }
}

export default CompanyInvite;