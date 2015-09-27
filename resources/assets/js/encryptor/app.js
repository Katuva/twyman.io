require('angular');
require('angular-ui-router');

import EncryptService from './EncryptorService';
import autoFocus from '../autoFocusDirective';
import confirmAgainst from '../confirmAgainst';

angular.module('app', ['ui.router'])
    .factory('EncryptData', () => {
        return {};
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/encrypt");

        $stateProvider
            .state('encrypt', {
                url: '/encrypt',
                templateUrl: '../partials/encryptor/encrypt.html',
                controller: 'EncryptController as encrypt'
            })
            .state('encrypt-upload', {
                url: '/upload',
                templateUrl: '../partials/encryptor/encrypt-upload.html',
                controller: 'UploadController as upload'
            })
            .state('decrypt', {
                url: '/decrypt/{url_key}',
                templateUrl: '../partials/encryptor/decrypt.html',
                controller: 'DecryptController as decrypt'
            });
    })
    .directive('autoFocus', autoFocus)
    .directive('ngConfirmField', confirmAgainst)
    .service('EncryptorService', EncryptService)
    .controller('EncryptController', function(EncryptData, EncryptorService, $state) {
        this.EncryptData = EncryptData;

        this.encrypt = () => {
            EncryptData.encrypting = true;

            EncryptorService.encrypt(this.plainText, this.password).then((data) => {
                EncryptData.cipherText = data;
                $state.go('encrypt-upload');
                EncryptData.encrypting = false;
            }, () => {
                console.log('Failed.');
                EncryptData.encrypting = false;
            }, (progress) => {
                angular.element(document.querySelector('#encryptProgress')).html(progress);
            });
        };
    })
    .controller('UploadController', function(EncryptData, $http) {
        this.EncryptData = EncryptData;
        this.timeOptions = [
            '30 minutes',
            '1 hour',
            '2 hours',
            '3 hours',
            '6 hours',
            '12 hours',
            '1 day',
            '2 days',
            '3 days',
            '4 days',
            '5 days',
            '6 days',
            '7 days'
        ];

        this.upload = () => {
            $http.post('/api/v1/encryptor', EncryptData)
                .then((response) => {
                    console.log(response.data);
                }, (response) => {
                    console.log(response);
                }
            );
        }
    })
    .controller('DecryptController', function(EncryptData, EncryptorService, $stateParams, $state) {
        this.EncryptData = EncryptData;
        this.EncryptData.url_key = $stateParams.url_key;

        console.log($state.href('decrypt', {url_key: this.EncryptData.url_key}));

        this.decrypt = () => {
            EncryptData.decrypting = true;

            EncryptorService.decrypt(EncryptData.cipherText, this.password).then((data) => {
                EncryptData.plainText = data.data;
            }, () => {
                console.log('Failed.');
            }, (progress) => {
                angular.element(document.querySelector('#decryptProgress')).html(progress);
            });
        };
    });
