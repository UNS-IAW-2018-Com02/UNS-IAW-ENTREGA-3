<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('indexAdmin', [ 'title' => 'LaLiga Admin']);
});

Route::get('/equipos', function () {
    return view('equiposAdmin', [ 'title' => 'LaLiga Admin']);
});

Route::get('/noticias', function () {
    return view('noticiasAdmin', [ 'title' => 'LaLiga Admin']);
});

Route::get('/fechas', function () {
    return view('fechasAdmin', [ 'title' => 'LaLiga Admin']);
});

Route::get('/opciones', function () {
    return view('opcionesAdmin', [ 'title' => 'LaLiga Admin']);
});


//----Posts-----//

//Opciones
Route::post('/guardarOpciones', 'OpcionesController@store');

//Equipos
Route::post('/nuevoEquipo', 'EquiposController@store');
Route::post('/eliminarEquipo', 'EquiposController@destroy');

//Jugadores
Route::post('/nuevoJugador', 'JugadoresController@store');
Route::post('/eliminarJugador', 'JugadoresController@destroy');

//Fixture
Route::post('/armarFixture', 'FechasController@store');
Route::post('/editarPartido', 'FechasController@update');

//Noticias
Route::post('/alta_baja_noticia', 'NoticiasController@store');
Route::post('/eliminarNoticia', 'NoticiasController@destroy');