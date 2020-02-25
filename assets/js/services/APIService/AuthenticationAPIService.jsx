import axios from 'axios';
import React from 'react';
import _ from 'lodash';

export default class AuthenticationService {
    static getJWT(credentials) {
        let url = 'https://localhost:8000/api/login_check';

        return new Promise((resolve, reject) => {
            axios
                .post(url, credentials)
                .then(response => {
                    if (_.has(response, 'data.token')) {
                        return resolve();
                    }

                    reject('error');
                })
                .catch(error => {
                    if (_.has(error, 'response.status') && error.response.status === 401) {
                        return reject('bad credentials');
                    }

                    if (_.has(error, 'message') && error.message === 'Network Error') {
                        return reject('network error');
                    }

                    reject('error');
                });
        });
    }
};
