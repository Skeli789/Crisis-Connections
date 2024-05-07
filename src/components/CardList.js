import Card from './Card';
import dayjs from "dayjs";
import { formatDate, getName } from './utils';
  
export default function CardList({callers = []}) {
    const list = callers?.map(caller => {
        const lastCalled = formatDate(caller.callHistory[0].dateTime);
        const name = getName(caller.firstName,caller.lastName);
        const services = [...new Set(caller.callHistory.map(log => log.service))];
        const isArchived = caller.archived.isArchived;
        const aka = caller.aka.join(', ');
        const sixMonthsAgo = dayjs().subtract(2, 'month');
        // const sixMonthsAgo = dayjs().subtract(6, 'month');
        const isOld = dayjs(lastCalled).isBefore(sixMonthsAgo, 'day');

        return (
            <li key={caller.id}>
                <Card   id = {caller.id}
                        name = {name}
                        aka = {aka}
                        phoneNumbers = {caller.phoneNumbers}
                        lastCalled = {lastCalled}
                        services = {services}
                        isArchived = {isArchived}
                        isOld = {isOld}
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