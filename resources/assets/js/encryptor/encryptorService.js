export default class EncryptorService {
    constructor($q, $window) {
        this._$q = $q;
        this._$window = $window;
    }

    encrypt(data, key) {
        var defer = this._$q.defer();
        var progress = [];

        triplesec.encrypt({
            data:          new Buffer(data),
            key:           new Buffer(key),
            progress_hook: (p) => {
                var h, pr, _i, _len;

                if (progress.length && (progress[progress.length - 1].what === p.what)) {
                    progress[progress.length - 1] = p;
                } else {
                    progress.push(p);
                }

                h = "";

                for (_i = 0, _len = progress.length; _i < _len; _i++) {
                    pr = progress[_i];
                    h += '<li class="encryptionProgress">' + pr.what + ' ' + pr.i + '/' + pr.total + '</li>';
                }

                defer.notify(h);
            }
        }, (err, buff) => {
            if (!err) defer.resolve(buff.toString('hex'));
            else defer.reject();
        });

        return defer.promise;
    }

    decrypt(data, key) {
        var defer = this._$q.defer();
        var progress = [];

        triplesec.decrypt ({
            data:          new triplesec.Buffer(data, 'hex'),
            key:           new triplesec.Buffer(key),
            progress_hook: (p) => {
                var h, pr, _i, _len;

                if (progress.length && (progress[progress.length - 1].what === p.what)) {
                    progress[progress.length - 1] = p;
                } else {
                    progress.push(p);
                }

                h = "";

                for (_i = 0, _len = progress.length; _i < _len; _i++) {
                    pr = progress[_i];
                    h += '<li class="encryptionProgress">' + pr.what + ' ' + pr.i + '/' + pr.total + '</li>';
                }

                defer.notify(h);
            }
        }, (err, buff) => {
            if (!err) {
                var output = buff.toString();
                var reg = /^data:(.*);.*,/ig;
                var match = reg.exec(output);

                if (match !== null) {
                    output = output.replace(/^data:.*;.*,/ig, '');
                    output = this.b64toBlob(output, match[1]);
                    output = this._$window.URL.createObjectURL(output);
                    output = {
                        data: output,
                        file: true
                    };
                }
                else {
                    output = {
                        data: output,
                        file: false
                    };
                }

                defer.resolve(output);
            }
            else {
                defer.reject();
            }
        });

        return defer.promise;
    }

    static b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }
}
