@extends('layouts.main.master')

@section('title', 'Encrypt')

@section('js')
    {!! Html::script('js/triplesec.js') !!}
    {!! Html::script('js/encryptor.js') !!}
@endsection

@section('body')
    <div>
        <div class="container">
            <div class="row">
                <div class="col-md-7">
                    <div ui-view></div>
                </div>
            </div>
        </div>
    </div>
@endsection
