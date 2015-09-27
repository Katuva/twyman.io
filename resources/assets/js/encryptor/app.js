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
            .state('encrypt-finish', {
                url: '/encrypt-finish',
                templateUrl: '../partials/encryptor/encrypt-finish.html',
                controller: 'EncryptFinishController as finish'
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
                // TODO: Add proper error handling
                console.log('Failed.');
                EncryptData.encrypting = false;
            }, (progress) => {
                angular.element(document.querySelector('#encryptProgress')).html(progress);
            });
        };
    })
    .controller('UploadController', function(EncryptData, $http, $state) {
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
                    this.EncryptData.url_key = response.data.url_key;
                    this.EncryptData.url = `${response.data.url}${$state.href('decrypt', {url_key: this.EncryptData.url_key})}`;
                    $state.go('encrypt-finish');
                }, (response) => {
                    // TODO: Add proper error handing
                    console.log(response);
                }
            );
        }
    })
    .controller('EncryptFinishController', function(EncryptData, $state) {
        this.EncryptData = EncryptData;

        this.view = () => {
            $state.go('decrypt', {url_key: this.EncryptData.url_key});
        }
    })
    .controller('DecryptController', function(EncryptData, EncryptorService, $http, $stateParams, $state) {
        this.EncryptData = EncryptData;

        $http.get(`/api/v1/encryptor/${$stateParams.url_key}`)
            .then((response) => {
                this.EncryptData = {
                    cipherText: response.data.data,
                    expires: response.data.expires,
                    maxViews: response.data.max_views,
                    views: response.data.views
                };
            }
        );

        this.decrypt = () => {
            this.EncryptData.decrypting = true;

            EncryptorService.decrypt(this.EncryptData.cipherText, this.password).then((data) => {
                this.EncryptData.plainText = data.data;
                console.log(this.EncryptData.plainText);
            }, () => {
                // TODO: Add proper error handling
                console.log('Failed.');
            }, (progress) => {
                angular.element(document.querySelector('#decryptProgress')).html(progress);
            });
        };
    });
