require('angular');
require('angular-ui-router');

import EncryptService from './EncryptorService';
import autoFocus from '../autoFocusDirective';
import confirmAgainst from '../confirmAgainstDirective';
import fromNow from '../fromNowFilter';

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
            })
            .state('decrypt-finish', {
                url: '/decrypt-finish',
                templateUrl: '../partials/encryptor/decrypt-finish.html',
                controller: 'DecryptFinishController as finish'
            })
            .state('404', {
                url: '/404',
                templateUrl: '../partials/encryptor/404.html'
            });
    })
    .filter('fromNow', fromNow)
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
                    EncryptData.url_key = response.data.url_key;
                    EncryptData.url = `${response.data.url}${$state.href('decrypt', {url_key: this.EncryptData.url_key})}`;
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
            $state.go('decrypt', {url_key: EncryptData.url_key});
        }
    })
    .controller('DecryptController', function(EncryptData, EncryptorService, $http, $stateParams, $state) {
        this.EncryptData = EncryptData;

        $http.get(`/api/v1/encryptor/${$stateParams.url_key}`)
            .then((response) => {
                EncryptData.cipherText = response.data.data;
                EncryptData.expires = response.data.expires;
                EncryptData.maxViews = response.data.max_views;
                EncryptData.views = response.data.views;
            }, (response) => {
                if (response.status === 404) $state.go('404');
            }
        );

        this.decrypt = () => {
            EncryptData.decrypting = true;

            EncryptorService.decrypt(this.EncryptData.cipherText, this.password).then((data) => {
                EncryptData.plainText = data.data;
                $state.go('decrypt-finish');
                EncryptData.decrypting = false;
            }, () => {
                // TODO: Add proper error handling
                console.log('Failed.');
                EncryptData.decrypting = false;
            }, (progress) => {
                angular.element(document.querySelector('#decryptProgress')).html(progress);
            });
        };
    })
    .controller('DecryptFinishController', function(EncryptData) {
        this.EncryptData = EncryptData;
    });
