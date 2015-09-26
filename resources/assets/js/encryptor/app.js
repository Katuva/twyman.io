require('angular');
require('angular-ui-router');

import EncryptService from './EncryptorService';

angular.module('app', ['ui.router'])
    .factory('EncryptData', () => {
        return {};
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('start', {
                url: "/",
                templateUrl: "../partials/encryptor/encrypt-start.html",
                controller: "EncryptController as encrypt"
            })
            .state('upload', {
                url: "/upload",
                templateUrl: "../partials/encryptor/encrypt-upload.html",
                controller: "UploadController as upload"
            })
            .state('finish', {
                url: "/finished",
                templateUrl: "../partials/encryptor/encrypt-finish.html",
                controller: "EncryptFinishController as finish"
            });
    })
    .service('EncryptorService', EncryptService)
    .controller('EncryptController', function(EncryptData, EncryptorService) {
        this.EncryptData = EncryptData;

        this.encrypt = () => {
            EncryptorService.encrypt('This is a test', 'test').then((data) => {
                EncryptData.cipherText = data;
            }, () => {
                console.log('Failed.');
            }, (progress) => {
                angular.element(document.querySelector('#progressEncrypt')).html(progress);
            });
        };
    })
    .controller('UploadController', function(EncryptData) {
        this.EncryptData = EncryptData;
    })
    .controller('EncryptFinishController', function() {
        // TODO
    })
    .controller('DecryptController', function(EncryptData, EncryptorService) {
        this.EncryptData = EncryptData;

        this.decrypt = () => {
            var data = '1c94d7de00000003ea1ac4ee6f97c85d218865b77ab7858533ebb53fc9e86046eff6c8ba4f73ad51d10ed37b61feae1b9fdd75422f056eebf033e03c3097895cfb0e677a8a6ca39456c7b92947a80e9a82146f1bb207ccaa35733d0256ace47cf05bf4ca89cbdcee004ed33b3e46b206042293614b47cce99580b35add7f20817803b6891015989017d614ec9cc0d7f31ca186e538403a6c7d56296289e3e1f7b63a8c0ef26898566d0400b3a40a4dd03a77f09032a51a2f6d10cc73744462367d85b58fd678dbeb1498fa4d1245aa0905cf10c0c35b0ec0a385789a48e9'
            var key = 'test';

            EncryptorService.decrypt(data, key).then((data) => {
                EncryptData.plainText = data.data;
            }, () => {
                console.log('Failed.');
            }, (progress) => {
                angular.element(document.querySelector('#progressDecrypt')).html(progress);
            });
        };
    });

console.log('Loaded encryptor.js');
