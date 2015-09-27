export default ($timeout) => {
    return {
        restrict: 'AC',
        link: function(scope, element) {
            $timeout(() => {
                element[0].focus();
            });
        }
    };
}
