import axios from 'axios';

export default class CustomerAPIService {
    static paginatedFindByNameOrCompanyStartsBy(itemsPerPage = 5, pageNumber = 1, searchValue = '') {
        let url =
            'https://localhost:8000/api/customers' +
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
                .delete('https://localhost:8000/api/customers/' + id)
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
