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
        const pagesCount = calculatePagesCount();
        let items = [];
        for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber++) {
            items.push(
                <Pagination.Item
                    key={pageNumber} onClick={() => goToPage(pageNumber)}
                    active={pageNumber === props.currentPageNumber}
                >
                    {pageNumber}
                </Pagination.Item>
            );
        }

        // Prevents empty page if last item on last page has been deleted.
        if (pagesCount < props.currentPageNumber) {
            goToPreviousPage();
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
