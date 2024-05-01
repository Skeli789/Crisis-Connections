import { formatPhoneNumber, getLabelName } from "./utils";
import Button from '@mui/material/Button';
  
export default function Card({
    name = 'Anonymous',
    aka = '-',
    phoneNumbers = [], 
    lastCalled = '', 
    services = []
}) {
    const phoneList = phoneNumbers.map(number => {
        return <dd key={number} className='font-body'>{formatPhoneNumber(number)}</dd>;
    });

    const serviceList = services.map(hotline => {
        return <dd key={hotline} className='font-body'>{getLabelName(hotline)}</dd>;
    });

    const displayName = name ? name.trim() : 'Anonymous';
    aka = aka ? aka : '-';

    return (
        <div className='card'>
            <dl className='card-data'>
                <div className='card-data_detail name'>
                    <dt className='font-label'>Name</dt>
                    <dd className='font-body-bold'>{displayName}</dd>
                </div>
                <div className='card-data_detail aka'>
                    <dt className='font-label'>{getLabelName('aka', true)}</dt>
                    <dd className='font-body'>{aka}</dd>
                </div>
                <div className='card-data_detail phone-numbers'>
                    <dt className='font-label'>Phone Number(s)</dt>
                    {phoneList}
                </div>
                <div className='card-data_detail last-called'>
                    <dt className='font-label'>{getLabelName('lastCalled')}</dt>
                    <dd className='font-body'>{lastCalled}</dd>
                </div>
                <div className='card-data_detail services'>
                    <dt className='font-label'>Services Contacted</dt>
                    {serviceList}
                </div>
            </dl>
            <Button variant="contained" disableElevation>
                View Details
            </Button>
        </div>
    );
}