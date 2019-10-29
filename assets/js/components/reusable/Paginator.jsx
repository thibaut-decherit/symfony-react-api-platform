import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default props => {
    const calculatePagesCount = () => {
        return Math.ceil(props.totalItemsCount / props.itemsPerPage);
    };

    const goToPage = pageNumber => {
        props.setCurrentPageNumber(pageNumber);
    };

    const goToPreviousPage = () => {
        if (props.currentPageNumber > 1) {
            goToPage(props.currentPageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (props.currentPageNumber < calculatePagesCount()) {
            goToPage(props.currentPageNumber + 1);
        }
    };

    const generatePaginationItems = () => {
        let items = [];
        for (let pageNumber = 1; pageNumber <= calculatePagesCount(); pageNumber++) {
            items.push(
                <Pagination.Item
                    key={pageNumber} onClick={() => goToPage(pageNumber)}
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
            <Pagination className="d-flex justify-content-center" size="sm">
                <Pagination.Prev onClick={() => goToPreviousPage()}/>
                {items}
                <Pagination.Next onClick={() => goToNextPage()}/>
            </Pagination>
        );
    } else {
        return null;
    }
};
