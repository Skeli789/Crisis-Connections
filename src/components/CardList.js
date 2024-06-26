import Card from './Card';
import { formatDate, getName, isOld } from '../utils/utils';
  
export default function CardList({callers = []}) {
    const list = callers?.map(caller => {
        const lastCalled = caller.callHistory != null && caller.callHistory.length > 0 ? formatDate(caller.callHistory[0].dateTime) : "Never";
        const name = getName(caller.firstName,caller.lastName);
        const services = [...new Set(caller.callHistory.map(log => log.service))];
        const isArchived = caller.archived.isArchived;
        const aka = caller.aka;

        return (
            <li key={caller.id}>
                <Card   id = {caller.id}
                        name = {name}
                        aka = {aka}
                        phoneNumbers = {caller.phoneNumbers}
                        lastCalled = {lastCalled}
                        services = {services}
                        isArchived = {isArchived}
                        isOld = {isOld(lastCalled)}
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