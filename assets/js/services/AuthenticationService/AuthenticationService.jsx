import moment from 'moment';
import React from 'react';
import AuthenticationAPIService from '../APIService/AuthenticationAPIService'

export default class AuthenticationService {
    static login(credentials) {
        return new Promise((resolve, reject) => {
            AuthenticationAPIService.getJWT(credentials)
                .then(() => {
                    resolve('success');
                })
                .catch(error => {
                    reject(error);
                })
        });
    }
};
