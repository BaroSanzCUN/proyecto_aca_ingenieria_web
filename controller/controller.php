<?php
    echo "Hello World!";
    if(isset($_POST['get_btn'])){
        $data = array(
            array("nombre" => "servicios", "title" => "Servicio 1", "descripcion" => "Descripc del servicio 1"),
            array("nombre" => "empleados", "title" => "Empleado 1", "descripcion" => "Descripcion del empleado 1"),
            array("nombre" => "usuarios", "title" => "Usuario 1", "descripcion" => "Descripcion del usuario 1"),
            array("nombre" => "agendas", "title" => "Agenda 1", "descripcion" => "Descripcion de la agenda 1")
        );

        echo json_encode($data);
    }
?>