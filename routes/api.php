<?php

use App\Equipo;
use App\Fecha;
use App\Noticia;
use App\Configuracion;
use App\User;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/equipos', function () {
    return Equipo::all();
});

Route::get('/fechas', function () {
    return Fecha::all();
});

Route::get('/noticias', function () {
    return Noticia::all();
});

Route::get('/configuracion', function () {
    return Configuracion::all();
});

Route::get('/users', function () {
    return User::all();
});