export default ($timeout) => {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(() => {
                _element[0].focus();
            });
        }
    };
}
