export default () => {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, control) {

            var updateValidity = function () {
                var viewValue = control.$viewValue;
                var isValid = isFieldValid();
                control.$setValidity('noMatch', isValid);

                return isValid ? viewValue : undefined;
            };

            var isFieldValid = function () {
                return control.$viewValue === currentConfirmAgainstValue();
            };

            function currentConfirmAgainstValue() {
                return scope.$eval(attrs.confirmAgainst);
            }

            control.$parsers.push(updateValidity);

            scope.$watch('confirmAgainst', updateValidity);
            scope.$watch(function () {
                return currentConfirmAgainstValue();
            }, updateValidity);
        }
    };
}
