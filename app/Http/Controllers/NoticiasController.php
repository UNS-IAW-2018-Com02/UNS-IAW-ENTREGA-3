<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Noticia;

class NoticiasController extends Controller
{
     public function store(Request $request){

          error_log($request);

     	$titulo = request('titulo');
     	$estado = request('estado');
     	$noticia = Noticia::where('titulo', $titulo)->first();
     	$noticia->seleccionada = $estado;
     	$noticia->save();

	}

	 public function destroy(Request $request){

		$titulo = request('titulo');
     	$noticia = Noticia::where('titulo', $titulo)->first();
     	$noticia->delete();
     	
	}
}