<!DOCTYPE html>
<html lang="en" ng-app="app">
    <head>
        <meta charset="UTF-8">
        <title>@yield('title') - twyman.io</title>

        @section('css')
            {!! Html::style('css/app.css') !!}
        @show
    </head>
    <body>
        @yield('body')

        @section('js')
            {!! Html::script('js/main.js') !!}
        @show
    </body>
</html>
