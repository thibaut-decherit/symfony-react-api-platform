import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default ({itemsPerPage, totalItemsCount, currentPageNumber, setCurrentPageNumber}) => {
    const calculatePagesCount = () => {
        return Math.ceil(totalItemsCount / itemsPerPage);
    };

    const goToPage = pageNumber => {
        if (pageNumber === currentPageNumber) {
            return;
        }

        setCurrentPageNumber(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentPageNumber > 1) {
            goToPage(currentPageNumber - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPageNumber < calculatePagesCount()) {
            goToPage(currentPageNumber + 1);
        }
    };

    const generatePaginationItems = () => {
        const pagesCount = calculatePagesCount();
        let items = [];
        for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber++) {
            items.push(
                <Pagination.Item
                    key={pageNumber} onClick={() => goToPage(pageNumber)}
                    active={pageNumber === currentPageNumber}
                >
                    {pageNumber}
                </Pagination.Item>
            );
        }

        // Prevents empty page if last item on last page has been deleted.
        if (pagesCount < currentPageNumber) {
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
