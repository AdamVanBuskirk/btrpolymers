import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../Core/hooks';
import { getSettings, loadSubComponent } from '../../Store/Settings';
import { loadedSubComponentType } from '../../Helpers/types';

function SubNav() {

    const dispatch = useAppDispatch();
    const settingsState = useAppSelector(getSettings);
    const settings = settingsState.settings;
    //const loadedSubComponent = settings.loadedSubComponentType;
    const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];

    let navigation = <div />;

    if (settings.loadedComponentType === "settings") {
        navigation = (
            <div className="nav-tabs">
                <div className={loadedSubComponent === 'company' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({ parent: settings.loadedComponentType, child: 'company'}))}>
                    Company
                </div>
                <div className={loadedSubComponent === 'teams' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'teams'}))}>
                    Teams
                </div>
                <div className={loadedSubComponent === 'users' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'users'}))}>
                    Users
                </div>
                <div className={loadedSubComponent === 'actions' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'actions'}))}>
                    Config
                </div>
                <div className={loadedSubComponent === 'delivery' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'delivery'}))}>
                    Notifications
                </div>
            </div>
        );
    } else if (settings.loadedComponentType === "lists") {
        navigation = (
            <div className="nav-tabs">
                <div className={loadedSubComponent === 'customer' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'customer'}))}>
                    Contacts
                </div>
                <div className={loadedSubComponent === 'product' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'product'}))}>
                    Docs
                </div>
            </div>
        );
    } else if (settings.loadedComponentType === "meetings") {
        navigation = (
            <div className="nav-tabs">
                <div className={loadedSubComponent === 'daily' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'daily'}))}>
                    Daily
                </div>
                <div className={loadedSubComponent === 'weekly' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'weekly'}))}>
                    Weekly
                </div>
                <div className={loadedSubComponent === 'monthly' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'monthly'}))}>
                    Monthly
                </div>
                <div className={loadedSubComponent === 'quarterly' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'quarterly'}))}>
                    Quarterly
                </div>
            </div>
        );
    } else if (settings.loadedComponentType === "data") {
        navigation = (
            <div className="nav-tabs">
                <div className={loadedSubComponent === 'scorecards' || loadedSubComponent === 'quickstats' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'scorecards'}))}>
                    Scorecards
                </div>
                <div className={loadedSubComponent === 'dashboards' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'dashboards'}))}>
                    Dashboards
                </div>
                <div className={loadedSubComponent === 'reports' ? 'tab active' : 'tab'} 
                    onClick={() => dispatch(loadSubComponent({  parent: settings.loadedComponentType, child: 'reports'}))}>
                    Reports
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", fontSize: "14pt", 
            backgroundColor: "#fff", margin: "0px 10px" }}>
            {/* Contextual sub menu based on Nav selection */}
            {navigation}
        </div>
    );
}

export default SubNav;