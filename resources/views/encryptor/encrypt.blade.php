@extends('layouts.main.master')

@section('title', 'Encrypt')

@section('js')
    {!! Html::script('js/triplesec.js') !!}
    {!! Html::script('js/encryptor.js') !!}
@endsection

@section('body')
    <div ng-controller="EncryptController as encrypt">
        <div class="container">
            <div class="row">
                <div class="col-md-7">
                    <div ui-view></div>
                    <br><br>
                    <a ui-sref="upload" class="btn btn-primary">Test</a>
                </div>
            </div>
        </div>
    </div>
@endsection
