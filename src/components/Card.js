import { formatPhoneNumber, getLabelName } from "./utils";
  
export default function Card({
    name = 'Anonymous',
    aka = '-',
    phoneNumbers = [], 
    lastCalled = '', 
    services = []
}) {
    const phoneList = phoneNumbers.map(number => {
        return <dd key={number}>{formatPhoneNumber(number)}</dd>;
    });

    const serviceList = services.map(hotline => {
        return <dd key={hotline}>{getLabelName(hotline)}</dd>;
    });

    return (
        <div className="card">
            <dl className="card-data">
                <dt className='card-data_name'>Name</dt>
                <dd>{name}</dd>
                <dt className='card-data_aka'>{getLabelName('aka', true)}</dt>
                <dd>{aka}</dd>
                <dt className='card-data_phone-numbers'>Phone Number(s)</dt>
                {phoneList}
                <dt className='card-data_last-called'>{getLabelName('lastCalled')}</dt>
                <dd>{lastCalled}</dd>
                <dt className='card-data_services'>Services Used</dt>
                {serviceList}
            </dl>
        </div>
    );
}