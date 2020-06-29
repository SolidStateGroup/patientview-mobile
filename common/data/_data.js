module.exports = {
    token: '',
    type: '',

    status: function (response) { //handle ajax requests
        if (response.status == 401) {
            AccountStore.trigger('unauthorized');
            return Promise.reject("Unauthorized with" + this.token)
        }
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return response.text()
                .then((res) => {
                    try {
                        res = JSON.parse(res)
                    } catch (e) {
                    }
                    return Promise.reject(res)
                });
        }
    },

    get: function (url, data, useString, headers) {
        return this._request('get', url, data || null, useString, headers);
    },

    put: function (url, data, useString) {
        return this._request('put', url, data, useString);
    },

    post: function (url, data, useString) {
        return this._request('post', url, data, useString);
    },

    delete: function (url, data, useString) {
        return this._request('delete', url, data, useString);
    },

    _request: function (method, url, data, useString, headers = {}) {
        var options = {
                timeout: 60000,
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    ...headers
                }
            },
            req;

        if (this.token) { //add auth tokens to headers of all requests
            options.headers['X-Auth-Token'] = this.token;
        }

        if (data) {
            options.body = JSON.stringify(data);
        } else if (method == "post" || method == "put") {
            options.body = "{}";
        }

        req = fetch(url, options);

        // console.log('Fetch', { request: { url, options } });

        return req
            .then((res) => this.status(res))
            .then(function (response) { //always return json
                // console.log('Fetch', { response });
                return response.text()
            }).then((res) => {
                if (useString) {
                    return res
                }
                try {
                    res = JSON.parse(res)
                } catch (e) {
                }
                return res;
            })


    },

    setToken: function (_token) {//set the token for future requests
        this.token = _token;
        if (Constants.simulate.TIMED_TOKEN) {
            this.token += "oops"
        }
    }
};