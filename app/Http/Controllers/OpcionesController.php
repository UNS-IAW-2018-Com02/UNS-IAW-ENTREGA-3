<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Configuracion;
use App\User;

class OpcionesController extends Controller
{
	public function store(Request $request){

		$usuariosS = request('usuariosS');	
		$usuariosNS = request('usuariosNS');

		$data = Configuracion::first();
		$data->equipos = (int)request('equipos');
		$data->cant_jugadores = (int)request('jugadores');
		$data->fecha = request('fecha');
		$data->save();

		if (!empty($usuariosS)){
			foreach($usuariosS as $user){
				$u = User::where('google.email', $user)->first();
				$u->editor = true;
				$u->save();
			}
		}

		if (!empty($usuariosNS)){
			foreach($usuariosNS as $userN){
				$u = User::where('google.email', $userN)->first();
				$u->editor = false;
				$u->save();
			}
		}
	
	
	}	
}