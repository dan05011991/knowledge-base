
'use strict';

var ldap = require('ldapjs');
const assert = require('assert');

function handler(user, callback) {
    let groups = [];

    var creds = {
    url: "ldap://localhost:389",
    bindDN: "cn=admin,dc=example,dc=org"
    };

    var opts = {
        filter: '(&(cn=*)(memberUid=' + user + '))',
        scope: 'sub',
        attributes: ['cn']
    };

    //binding
    function authDN(user, baseDN, password, cb) {
        client.bind(baseDN, password, function (err) {
            client.unbind();
            cb(err === null, err);
        });
    }

    function output(res, err) {				
        if (res) {
            console.log('success :' + res);
        } else {
            console.log(['Error :',err.code, err.dn, err.message ]);
        }
    }

    var client = ldap.createClient(creds);
    authDN(client, 'cn=admin,dc=example,dc=org', 'admin', output);

    //search
    var result = client.search('dc=example,dc=org', opts, function(err, res) {
        assert.ifError(err);

        res.on('searchEntry', function(entry) {
            console.log('entry: ' + JSON.stringify(entry.object));
            groups.push(entry.object['cn']);
        });
        res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
            console.log('status: ' + result.status);
            console.log('result: ' + result);
            console.log('Full result', groups);
            callback(groups);
        });
    });

    return result;
}

module.exports = handler;