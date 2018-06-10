<?php
namespace App;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Fecha extends Eloquent {
    protected $collection = 'fechas';
}