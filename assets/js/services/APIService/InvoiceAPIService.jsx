import axios from 'axios';

export default class InvoiceAPIService {
    // TODO: Rework search value (here and back-end)
    static paginatedFindByNameOrCompanyStartsBy(
        itemsPerPage = 5,
        pageNumber = 1,
        searchValue = ''
    ) {
        let url =
            'https://localhost:8000/api/invoices' +
            '?pagination=true' +
            `&itemsPerPage=${itemsPerPage}` +
            `&page=${pageNumber}`;

        if (searchValue !== '') {
            url += `&nameOrCompanyStartsBy=${searchValue}`;
        }

        return new Promise((resolve, reject) => {
            axios
                .get(url)
                .then(response => {
                    resolve({
                        results: response.data['hydra:member'],
                        totalItemsCount: response.data['hydra:totalItems']
                    });
                })
                .catch(error => {
                    console.error(error);

                    reject(error);
                });
        });
    }

    static deleteOneById(id) {
        return new Promise((resolve, reject) => {
            axios
                .delete('https://localhost:8000/api/invoices/' + id)
                .then(response => {
                    if (response.status < 300) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(error => {
                    console.error(error);

                    reject();
                });
        });
    }
}
