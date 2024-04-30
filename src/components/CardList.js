import Card from './Card';
import { formatDate } from './utils';
  
export default function CardList({callers = []}) {
    const list = callers?.map(caller => {
        // todo: customize with https://javascript.info/date
        const lastCalled = formatDate(caller.callHistory[0].dateTime);
        
        return (
            <li key={caller.id}>
                <Card   name = {`${caller.firstName} ${caller.lastName}`}
                        aka = {caller.aka}
                        phoneNumbers = {caller.phoneNumbers}
                        lastCalled={lastCalled}
                        services = {caller.services}
                />
            </li>
        );
    });

    return (
        <ul className="card-list">
            {list}
        </ul>
    );
}