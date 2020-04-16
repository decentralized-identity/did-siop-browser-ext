//OAuth 2.0
const invalid_request = {
    err: new Error('invalid_request'),
    response: {
        error: 'invalid_request',
        description: 'The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.',
        error_uri:''
    }
}

const unauthorized_client = {
    err: new Error('unauthorized_client'),
    response: {
        error: 'unauthorized_client',
        description: 'The client is not authorized to request an authorization code using this method.',
        error_uri: ''
    }
}

const access_denied = {
    err: new Error('access_denied'),
    response: {
        error: 'access_denied',
        description: 'The resource owner or authorization server denied the request.',
        error_uri: ''
    }
}

const unsupported_response_type = {
    err: new Error('unsupported_response_type'),
    response: {
        error: 'unsupported_response_type',
        description: 'The authorization server does not support obtaining an authorization code using this method.',
        error_uri: ''
    }
}

const invalid_scope = {
    err: new Error('invalid_scope'),
    response: {
        error: 'invalid_scope',
        description: 'The requested scope is invalid, unknown, or malformed.',
        error_uri: ''
    }
}

const server_error = {
    err: new Error('server_error'),
    response: {
        error: 'server_error',
        description: 'The authorization server encountered an unexpected condition that prevented it from fulfilling the request',
        error_uri: ''
    }
}

const temporarily_unavailable = {
    err: new Error('temporarily_unavailable'),
    response: {
        error: 'temporarily_unavailable',
        description: 'The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
        error_uri: ''
    }
}

//OpenId Connect
const interaction_required = {
    err: new Error('interaction_required'),
    response: {
        error: 'interaction_required',
        description: 'The Authorization Server requires End-User interaction of some form to proceed.',
        error_uri: ''
    }
}

const login_required = {
    err: new Error('login_required'),
    response: {
        error: 'login_required',
        description: 'The Authorization Server requires End-User authentication.',
        error_uri: ''
    }
}

const account_selection_required = {
    err: new Error('account_selection_required'),
    response: {
        error: 'account_selection_required',
        description: 'The End-User is REQUIRED to select a session at the Authorization Server.',
        error_uri: ''
    }
}

const consent_required = {
    err: new Error('consent_required'),
    response: {
        error: 'consent_required',
        description: 'The Authorization Server requires End-User consent.',
        error_uri: ''
    }
}

const invalid_request_uri = {
    err: new Error('invalid_request_uri'),
    response: {
        error: 'invalid_request_uri',
        description: 'The request_uri in the Authorization Request returns an error or contains invalid data.',
        error_uri: ''
    }
}

const invalid_request_object = {
    err: new Error('invalid_request_object'),
    response: {
        error: 'invalid_request_object',
        description: 'The request parameter contains an invalid Request Object.',
        error_uri: ''
    }
}

const request_not_supported = {
    err: new Error('request_not_supported'),
    response: {
        error: 'request_not_supported',
        description: 'The OP does not support use of the request parameter.',
        error_uri: ''
    }
}

const request_uri_not_supported = {
    err: new Error('request_uri_not_supported'),
    response: {
        error: 'request_uri_not_supported',
        description: 'The OP does not support use of the request_uri parameter',
        error_uri: ''
    }
}

const registration_not_supported = {
    err: new Error('registration_not_supported'),
    response: {
        error: 'registration_not_supported',
        description: 'The OP does not support use of the registration parameter',
        error_uri: ''
    }
}

module.exports = {
    ERROR_RESPONSES: [
        invalid_request,
        unauthorized_client,
        access_denied,
        unsupported_response_type,
        invalid_scope,
        server_error,
        temporarily_unavailable,
        interaction_required,
        login_required,
        account_selection_required,
        consent_required,
        invalid_request_uri,
        invalid_request_object,
        request_not_supported,
        request_uri_not_supported,
        registration_not_supported,
    ]
}
