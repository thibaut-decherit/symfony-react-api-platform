import _ from 'lodash';
import React from 'react';

export default class LodashHelper {
    /**
     * @param {object} object
     * @param {array} keys
     */
    static hasAll(object, keys) {
        return keys.every(value => {
            return _.has(object, value);
        });
    }
};
