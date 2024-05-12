import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import { formatPhoneNumber, getLabelName } from "../utils/utils";
import OldProfile from "./OldProfile";
  
export default function Card({
    id,
    name = 'Anonymous',
    aka = '-',
    phoneNumbers = [], 
    lastCalled = '', 
    services = [],
    isArchived = false,
    isOld = false
}) {

    const navigate = useNavigate();
    const routeChange = () => {
        let href = `${isArchived ? 'archive' : 'caller'}/${id}`;
        navigate(href);
    }

    aka = aka ? aka : '-';

    phoneNumbers = phoneNumbers.map(number => {
        return <dd key={number} className='font-body'>{formatPhoneNumber(number)}</dd>;
    });

    services = services.map(hotline => {
        return (
            <dd key={hotline} className='font-body'>
                <img className="card-data_services-logo" src={`${process.env.PUBLIC_URL}/images/logo_${hotline}-icon.svg`} alt={getLabelName(hotline)} title={getLabelName(hotline)}/>
            </dd>
        );
    });

    return (
        <div className='card' data-is-old={isOld} onClick={routeChange}>
            {(isOld && !isArchived) && <div className="card-alert"><OldProfile /></div>}
            <dl className='card-data'>
                <div className='card-data_detail name'>
                    <dt className='font-label'>Name</dt>
                    <dd className='font-body-bold'>
                        {name}
                        {isArchived && <span className='font-body italic'> (archived)</span>}
                    </dd>
                </div>
                <div className='card-data_detail aka'>
                    <dt className='font-label'>{getLabelName('aka', true)}</dt>
                    <dd className='font-body'>{aka}</dd>
                </div>
                <div className='card-data_detail phone-numbers'>
                    <dt className='font-label'>Phone Number(s)</dt>
                    {phoneNumbers}
                </div>
                <div className='card-data_detail last-called'>
                    <dt className='font-label'>
                        {getLabelName('lastCalled')}
                    </dt>
                    <dd className='font-body'>
                        {lastCalled}
                    </dd>
                </div>
                <div className='card-data_detail services'>
                    <dt className='font-label'>Services Contacted</dt>
                    {services}
                </div>
                <div className="card-footer">
                    <Button variant="text" disableElevation href={`#/${isArchived ? 'archive' : 'caller'}/${id}`}>
                        <span className="font-body-bold">View Details</span>
                        <span className="a11y-text">for {name}</span>
                    </Button>
                </div>
            </dl>
        </div>
    );
}