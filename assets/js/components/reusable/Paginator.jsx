import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default props => {
    const handleClick = pageNumber => {
        props.setCurrentPageNumber(pageNumber);
    };

    const generatePaginationItems = () => {
        const calculatePagesCount = () => {
            let count = props.totalItemsCount / props.itemsPerPage;

            if (props.totalItemsCount % props.itemsPerPage !== 0) {
                count++;
            }

            return count;
        };

        let items = [];
        for (let pageNumber = 1; pageNumber <= calculatePagesCount(); pageNumber++) {
            items.push(
                <Pagination.Item
                    key={pageNumber} onClick={() => handleClick(pageNumber)}
                    active={pageNumber === props.currentPageNumber}
                >
                    {pageNumber}
                </Pagination.Item>
            );
        }

        return items;
    };

    const items = generatePaginationItems();

    if (items.length > 1) {
        return (
            <Pagination className="d-flex justify-content-center" size="sm">{items}</Pagination>
        );
    } else {
        return null;
    }
};
