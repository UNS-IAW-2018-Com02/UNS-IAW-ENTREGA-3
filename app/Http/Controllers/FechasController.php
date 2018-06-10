<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Fecha;

class FechasController extends Controller
{
     public function store(Request $request){

     	$numero = request('numero');
     	$partidos = request('partidos');

     	$fecha = new Fecha;
     	$fecha->numero = (int)$numero;
     	$fecha->partidos = $partidos;
     	$fecha->save();

	}

	 public function update(Request $request){

	 	$numero = request('numero');
     	$fecha = request('fecha');
     	$hora = request('hora');
     	$estadio = request('estadio');
     	$idaux = (int)request('id');

          $id = ($idaux % 10)."";

     	$editor = request('editor');

     	$f = Fecha::where('numero', (int)$numero);
          $f->update(array('partidos.'.$id.'.fecha' => $fecha));
          $f->update(array('partidos.'.$id.'.horario' => $hora));
          $f->update(array('partidos.'.$id.'.estadio' => $estadio));
          $f->update(array('partidos.'.$id.'.editor' => $editor));  
     	

	}
}



