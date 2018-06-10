<?php
namespace App;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Noticia extends Eloquent {
    protected $collection = 'noticias';
}