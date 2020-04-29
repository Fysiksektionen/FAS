//
// DISCLAIMER: 
// Most of this was copied but modified from https://www.npmjs.com/package/cas-authentication
//

import { Request, Response } from "express" // express types

import { CLIENT_RENEG_WINDOW } from "tls";

const url         = require('url'),
    http          = require('http'),
    https         = require('https'),
    parseXML      = require('xml2js').parseString,
    XMLprocessors = require('xml2js/lib/processors');


import { CASOptionsType } from './CASOptions'

/**
 * The CAS authentication types.
 * @enum {number}
 */
enum AUTH_TYPE {
    BOUNCE = 0,
    BOUNCE_REDIRECT,
    BLOCK
}


/**
 * @typedef {Object} CAS_options
 * @property {string}  cas_url
 * @property {string}  service_url
 * @property {('1.0'|'2.0'|'3.0'|'saml1.1')} [cas_version='3.0']
 * @property {boolean} [renew=false]
 * @property {boolean} [is_dev_mode=false]
 * @property {string}  [dev_mode_user='']
 * @property {Object}  [dev_mode_info={}]
 * @property {string}  [session_name='cas_user']
 * @property {string}  [session_info=false]
 * @property {boolean} [destroy_session=false]
 */

/**
 * @param {CAS_options} options
 * @constructor
 */
function CASAuthentication(options: CASOptionsType) {

    if (!options || typeof options !== 'object') {
        throw new Error( 'CAS Authentication was not given a valid configuration object.');
    }
    if (options.cas_url === undefined) {
        throw new Error('CAS Authentication requires a cas_url parameter.');
    }
    if (options.service_url === undefined) {
        throw new Error( 'CAS Authentication requires a service_url parameter.');
    }

    this.cas_version = options.cas_version !== undefined ? options.cas_version : '3.0';

    if (this.cas_version === '1.0') {
        this._validateUri = '/validate';
        this._validate = function(body: String, callback: Function) {
            const lines = body.split('\n');
            if (lines[ 0 ] === 'yes' && lines.length >= 2) {
                return callback(null, lines[ 1 ]);
            }
            else if (lines[ 0 ] === 'no') {
                return callback( new Error('CAS authentication failed.'));
            }
            else {
                return callback( new Error('Response from CAS server was bad.'));
            }
        }
    }
    else if (this.cas_version === '2.0' || this.cas_version === '3.0') {
        this._validateUri = (this.cas_version === '2.0' ? '/serviceValidate' : '/p3/serviceValidate');
        this._validate = function(body: String, callback: Function) {
            parseXML(body, {
                trim: true,
                normalize: true,
                explicitArray: false,
                tagNameProcessors: [ XMLprocessors.normalize, XMLprocessors.stripPrefix ]
            }, function(err: Error, result: any) {
                if (err) {
                    return callback(new Error('Response from CAS server was bad.'));
                }
                try {
                    const failure = result.serviceresponse.authenticationfailure;
                    if (failure) {
                        return callback(new Error('CAS authentication failed (' + failure.$.code + ').'));
                    }
                    const success = result.serviceresponse.authenticationsuccess;
                    if (success) {
                        return callback(null, success.user, success.attributes);
                    }
                    else {
                        return callback(new Error( 'CAS authentication failed.'));
                    }
                }
                catch (err) {
                    console.log(err);
                    return callback(new Error('CAS authentication failed.'));
                }
            });
        }
    }
    else if(this.cas_version === 'saml1.1') {
        this._validateUri = '/samlValidate';
        this._validate = function(body: String, callback: Function) {
            parseXML(body, {
                trim: true,
                normalize: true,
                explicitArray: false,
                tagNameProcessors: [ XMLprocessors.normalize, XMLprocessors.stripPrefix ]
            }, function(err: Error, result: any) {
                if (err) {
                    return callback(new Error('Response from CAS server was bad.'));
                }
                try {
                    const samlResponse = result.envelope.body.response;
                    const success = samlResponse.status.statuscode.$.Value.split(':')[ 1 ];
                    if (success !== 'Success') {
                        return callback(new Error('CAS authentication failed (' + success + ').'));
                    }
                    else {
                        let attributes: any = {};
                        let attributesArray = samlResponse.assertion.attributestatement.attribute;
                        if (!(attributesArray instanceof Array)) {
                            attributesArray = [ attributesArray ];
                        }
                        attributesArray.forEach(function(attr: any){
                            let thisAttrValue;
                            if (attr.attributevalue instanceof Array){
                                thisAttrValue = [];
                                attr.attributevalue.forEach(function(v: any) {
                                    thisAttrValue.push(v._);
                                });
                            }
                            else {
                                thisAttrValue = attr.attributevalue._;
                            }
                            attributes[ attr.$.AttributeName ] = thisAttrValue;
                        });
                        return callback(null, samlResponse.assertion.authenticationstatement.subject.nameidentifier, attributes);
                    }
                }
                catch (err) {
                    console.log(err);
                    return callback(new Error('CAS authentication failed.'));
                }
            });
        }
    }
    else {
        throw new Error('The supplied CAS version ("' + this.cas_version + '") is not supported.');
    }

    this.cas_url         = options.cas_url;
    const parsed_cas_url   = url.parse(this.cas_url);
    this.request_client  = parsed_cas_url.protocol === 'http:' ? http : https;
    this.cas_host        = parsed_cas_url.hostname;
    this.cas_port        = parsed_cas_url.protocol === 'http:' ? 80 : 443;
    this.cas_path        = parsed_cas_url.pathname;

    this.service_url     = options.service_url;

    this.renew           = options.renew !== undefined ? !!options.renew : false;

    this.is_dev_mode     = options.is_dev_mode !== undefined ? !!options.is_dev_mode : false;
    this.dev_mode_user   = options.dev_mode_user !== undefined ? options.dev_mode_user : '';
    this.dev_mode_info   = options.dev_mode_info !== undefined ? options.dev_mode_info : {};

    this.session_name    = options.session_name !== undefined ? options.session_name : 'cas_user';
    this.session_info    = [ '2.0', '3.0', 'saml1.1' ].indexOf(this.cas_version) >= 0 && options.session_info !== undefined ? options.session_info : false;
    this.destroy_session = options.destroy_session !== undefined ? !!options.destroy_session : false;

    this.logout_url      = options.service_url;

    // Bind the prototype routing methods to this instance of CASAuthentication.
    this.bounce          = this.bounce.bind(this);
    this.bounce_redirect = this.bounce_redirect.bind(this);
    this.block           = this.block.bind(this);
    this.logout          = this.logout.bind(this);
}

/**
 * Bounces a request with CAS authentication. If the user's session is not
 * already validated with CAS, their request will be redirected to the CAS
 * login page.
 */
CASAuthentication.prototype.bounce = function(req: Request, res: Response, next: Function) {

    // Handle the request with the bounce authorization type.
    this._handle(req, res, next, AUTH_TYPE.BOUNCE);
};

/**
 * Bounces a request with CAS authentication. If the user's session is not
 * already validated with CAS, their request will be redirected to the CAS
 * login page.
 */
CASAuthentication.prototype.bounce_redirect = function(req: Request, res: Response, next: Function) {

    // Handle the request with the bounce authorization type.
    this._handle(req, res, next, AUTH_TYPE.BOUNCE_REDIRECT);
};

/**
 * Blocks a request with CAS authentication. If the user's session is not
 * already validated with CAS, they will receive a 401 response.
 */
CASAuthentication.prototype.block = function(req: Request, res: Response, next: Function) {

    // Handle the request with the block authorization type.
    this._handle(req, res, next, AUTH_TYPE.BLOCK);
};

/**
 * Handle a request with CAS authentication.
 */
CASAuthentication.prototype._handle = function(req: Request, res: Response, next: Function, authType: AUTH_TYPE) {

    // If the session has been validated with CAS, no action is required.
    if (req.session[ this.session_name ]) {
        // If this is a bounce redirect, redirect the authenticated user.
        if (authType === AUTH_TYPE.BOUNCE_REDIRECT) {
            res.redirect(req.session.cas_return_to);
        }
        // Otherwise, allow them through to their request.
        else {
            next();
        }
    }
    // If the authentication type is BLOCK, simply send a 401 response.
    else if (authType === AUTH_TYPE.BLOCK) {
        res.status(401).json({authenticated: false, message: "Unauthorized, please log in"});
    }
    // If dev mode is active, set the CAS user to the specified dev user.
    else if (this.is_dev_mode) {
        const username = this.dev_mode_user
        req.session[ this.session_name ] = username;
        req.session[ this.session_info ] = this.dev_mode_info;
        
        // If this is a bounce redirect, redirect the authenticated user.
        const next_step = () => authType === AUTH_TYPE.BOUNCE_REDIRECT 
            ? res.redirect(req.query.returnTo || this.service_url)
            : next() // Otherwise, allow them through to their request.
        
        // Create a user if first time login.
        next_step()
        // User.findOne({username}).then(user => 
        //     user ? next_step() : User.create({username, info:this.dev_mode_info}).then(next_step)
        // )
    }
    // If there is a CAS ticket in the query string, validate it with the CAS server.
    else if (req.query && req.query.ticket) {
        this._handleTicket(req, res, next);
    }
    // Otherwise, redirect the user to the CAS login.
    else {
        this._login(req, res, next);
    }
};

/**
 * Redirects the client to the CAS login.
 */
CASAuthentication.prototype._login = function(req: Request, res: Response, next: Function) {

    // Save the return URL in the session. If an explicit return URL is set as a
    // query parameter, use that. Otherwise, just use the URL from the request.
    req.session.cas_return_to = req.query.returnTo || url.parse(req.url).path;

    // Set up the query parameters.
    const query = {
        service: this.service_url + url.parse(req.url).pathname,
        renew: this.renew
    };

    // Redirect to the CAS login.
    res.redirect( this.cas_url + url.format({
        pathname: '/login',
        query: query
    }));
};

/**
 * Logout the currently logged in CAS user.
 */
CASAuthentication.prototype.logout = function(req: Request, res: Response, next: Function) {

    // Destroy the entire session if the option is set.
    if (this.destroy_session) {
        req.session.destroy(function(err: Error) {
            if (err) {
                console.log(err);
            }
        });
    }
    // Otherwise, just destroy the CAS session variables.
    else {
        delete req.session[ this.session_name ];
        if (this.session_info) {
          delete req.session[ this.session_info ];
        }
    }

    // Redirect the client to the CAS logout.
    res.redirect(this.logout_url);
};

/**
 * Handles the ticket generated by the CAS login requester and validates it with the CAS login acceptor.
 */
CASAuthentication.prototype._handleTicket = function(req: Request, res: Response, next: Function) {

    const requestOptions: RequestOptions = {
        host: this.cas_host,
        port: this.cas_port,
    };

    type RequestOptions = {
        host: String,
        port: String,
        method?: 'GET' | 'POST',
        path?: String,
        headers?: Object,
    }

    if (['1.0', '2.0', '3.0'].indexOf(this.cas_version) >= 0){
        requestOptions.method = 'GET';
        requestOptions.path = url.format({
            pathname: this.cas_path + this._validateUri,
            query: {
                service: this.service_url + url.parse(req.url).pathname,
                ticket: req.query.ticket
            }
        });
    }
    else if (this.cas_version === 'saml1.1'){
        var now = new Date();
        var post_data = '<?xml version="1.0" encoding="utf-8"?>\n' +
                        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">\n' +
                        '  <SOAP-ENV:Header/>\n' +
                        '  <SOAP-ENV:Body>\n' +
                        '    <samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1"\n' +
                        '      MinorVersion="1" RequestID="_' + req.host + '.' + now.getTime() + '"\n' +
                        '      IssueInstant="' + now.toISOString() + '">\n' +
                        '      <samlp:AssertionArtifact>\n' +
                        '        ' + req.query.ticket + '\n' +
                        '      </samlp:AssertionArtifact>\n' +
                        '    </samlp:Request>\n' +
                        '  </SOAP-ENV:Body>\n' +
                        '</SOAP-ENV:Envelope>';

        requestOptions.method = 'POST';
        requestOptions.path = url.format({
            pathname: this.cas_path + this._validateUri,
            query : {
                TARGET : this.service_url + url.parse(req.url).pathname,
                ticket: ''
            }
        });
        requestOptions.headers = {
            'Content-Type': 'text/xml',
            'Content-Length': Buffer.byteLength(post_data)
        };
    }

    let request = this.request_client.request(requestOptions, function(response: any) {
        response.setEncoding( 'utf8' );
        let body = '';
        response.on( 'data', function(chunk: String) {
            return body += chunk;
        }.bind(this));
        response.on('end', function() {
            this._validate(body, function(err: Error, username: String, attributes: Object) {
                if (err) {
                    console.log(err);
                    res.sendStatus(401);
                }
                else {
                    req.session[ this.session_name ] = username;
                    if (this.session_info) {
                        req.session[ this.session_info ] = attributes || {};
                    }
                    let redir = () => res.redirect(req.session.cas_return_to)
                    // Create a user if first time login.
                    redir() // redirect immediately instead of after user creation, since we dont have a user yet
                    // User.findOne({username}).then(user => 
                    //     user ? redir() : User.create({username, info:attributes}).then(redir)
                    // )
                }
            }.bind(this));
        }.bind(this));
        response.on('error', function(err: Error) {
            console.log('Response error from CAS: ', err);
            res.sendStatus(401);
        }.bind(this));
    }.bind(this));

    request.on('error', function(err: Error) {
        console.log('Request error with CAS: ', err);
        res.sendStatus(401);
    }.bind(this));

    if (this.cas_version === 'saml1.1') {
        request.write(post_data);
    }
    request.end();
};

module.exports = CASAuthentication;