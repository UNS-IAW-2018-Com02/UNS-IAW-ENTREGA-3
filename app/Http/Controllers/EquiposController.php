<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Equipo;

class EquiposController extends Controller
{
    public function store(Request $request){
 	
    	$nombre_equipo = request('nombre_equipo');
    	$m = substr($nombre_equipo, 0, -(strlen($nombre_equipo)-3));
    	$mov = strtoupper($m);
    	$team = Equipo::where('nombre_equipo', $nombre_equipo)->first();
    	if (empty($team)){
			$equipo = new Equipo;
			$equipo->nombre_equipo = $nombre_equipo;
			$equipo->estadio = request('estadio_equipo');
			$equipo->nombre_equipo_movil = $mov;
			$equipo->escudo = "../images/".$request->escudo_equipo->getClientOriginalName();
			$equipo->cantidad_integrantes = 0;
			$equipo->partidos_jugados = 0;
			$equipo->partidos_ganados = 0;
			$equipo->partidos_empatados = 0;
			$equipo->partidos_perdidos = 0;
			$equipo->goles_a_favor = 0;
			$equipo->goles_en_contra = 0;
			$equipo->jugadores = [];
			$equipo->save();
			$request->escudo_equipo->storeAs('', $request->escudo_equipo->getClientOriginalName());
			return response()->json(['respuesta' => 'Exito']);

		}		
		else			
			return response()->json(['respuesta' => 'Equipo Repetido']);
			

	}

	public function destroy(Request $request){

		$nombre_equipo = request('nombre_equipo');
		$equipo = Equipo::where('nombre_equipo', $nombre_equipo)->first();
		$equipo->delete();
		
	}
}
