require('angular');
require('angular-ui-router');

import EncryptService from './EncryptorService';
import autoFocus from '../autoFocusDirective'

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
    .controller('UploadController', function(EncryptData) {
        this.EncryptData = EncryptData;
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
