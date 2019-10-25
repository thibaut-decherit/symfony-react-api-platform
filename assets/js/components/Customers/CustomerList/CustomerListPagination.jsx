import React, {useState} from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default props => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleClick = pageNumber => {
        setCurrentPage(pageNumber);
        props.getCustomerPage(pageNumber);
    };

    const generatePaginationItems = () => {
        const calculatePagesCount = settings => {
            let count = settings.totalCustomersCount / settings.customersPerPage;

            if (settings.totalCustomersCount % settings.customersPerPage !== 0) {
                count++;
            }

            return count;
        };

        let items = [];
        for (let pageNumber = 1; pageNumber <= calculatePagesCount(props.settings); pageNumber++) {
            items.push(
                <Pagination.Item
                    key={pageNumber} onClick={() => handleClick(pageNumber)} active={pageNumber === currentPage}
                >
                    {pageNumber}
                </Pagination.Item>
            );
        }

        return items;
    };


    return (
        <Pagination className="d-flex justify-content-center" size="sm">{generatePaginationItems()}</Pagination>
    );
};
