<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Equipo;

class JugadoresController extends Controller
{
    public function store(Request $request){

    	$nombre_equipo = request('nombre_equipo');
    	$dorsal = request('dorsal');
    	$nombre = request('nombre_jugador');
    	$nacionalidad = request('nacionalidad');
    	$edad = request('edad');
    	$posicion = request('posicion');
		$equipo = Equipo::where('nombre_equipo', $nombre_equipo)->
						  where('jugadores','elemMatch', ['dorsal'=> (int)$dorsal])->first();
		if (empty($equipo)){
			$equipo = Equipo::where('nombre_equipo', $nombre_equipo)->first();
			$equipo->push('jugadores', array('dorsal' => (int)$dorsal, 
											 'nombre_jugador' => $nombre,
											 'edad' => (int) $edad,
											 'nacionalidad' => $nacionalidad,
											 'posicion' => $posicion,
											 'goles' => 0,
											 'asistencias' => 0,
											 'amarillas' => 0,
											 'rojas' => 0 ));
			$equipo->save();
			return response()->json(['respuesta' => 'Exito']);
		}
		else
			return response()->json(['respuesta' => 'Dorsal Repetido']);
	}

	public function destroy(Request $request){

		$nombre_equipo = request('nombre_equipo');
		$dorsal = request('dorsal');
		$equipo = Equipo::where('nombre_equipo', $nombre_equipo)->first();
		$equipo->pull('jugadores', array('dorsal' => (int)$dorsal));
		$equipo->save();
		
	}
}