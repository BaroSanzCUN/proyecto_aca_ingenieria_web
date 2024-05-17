<?php
        
    function connect(){
        $host = 'database-1.c5qm666g20kz.us-east-1.rds.amazonaws.com'; 
        $dbname = 'mysqldb';
        $user = 'admin';
        $password = 'adminbdbaro';
        $port = '3306';
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
        $pdo = new PDO($dsn, $user, $password);
        return $pdo;
    }
    // get data from database
    function getData($tabledb){
        $pdo = connect();
        $sql = "SELECT * FROM $tabledb ORDER BY id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC ); // (PDO::FETCH_ASSOC, PDO::FETCH_NUM, PDO::FETCH_BOTH, PDO::FETCH_OBJ
        $erro_info = $stmt->errorInfo();
        $output = array(
            'success' => false,
            'error' => $erro_info[0],
            'message' => $erro_info[2]
        );
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['data'] = $data;
        }
        return $output;
    }

    // get data from database
    function getDataById($tabledb, $id){
        $pdo = connect();
        $sql = "SELECT * FROM $tabledb WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $data = $stmt->fetchAll();
        $erro_info = $stmt->errorInfo();
        $output = array(
            'success' => false,
            'error' => $erro_info[0],
            'message' => $erro_info[2]
        );
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['data'] = $data;
        }
        return $output;
    }

    // insert data to database
    function insertData($tabledb, $data, $columns, $values){
        $pdo = connect();
        $sql = "INSERT INTO $tabledb ($columns) VALUES ($values)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);
        $erro_info = $stmt->errorInfo();
        $output = array(
            'success' => false,
            'error' => $erro_info[0],
            'message' => $erro_info[2],
        );
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['message'] = 'Registro Insertado Correctamente';
            $output['id'] = $pdo->lastInsertId();
            $output['data'] = $data;
            $output['columnas'] = $columns;
            $output['valores'] = $values;
        }
        return $output;
    }

    // update data in database
    function updateData($tabledb, $data_set, $values, $id){
        $pdo = connect();
        $sql = "UPDATE $tabledb SET $data_set WHERE id = :id";
        $stmt = $pdo->prepare($sql);
    
        // Vincula los valores de los marcadores de posición en la consulta SQL
        foreach ($values as $key => $val) {
            $stmt->bindValue(':'.$key, $val);
        }
        $stmt->bindParam(':id', $id, PDO::PARAM_INT); // Asumiendo que $id es un entero
    
        $stmt->execute();
        $erro_info = $stmt->errorInfo();
        $output = array(
            'success' => false,
            'error' => $erro_info[0],
            'message' => $erro_info[2],
            'sql' => $sql
        );
    
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['message'] = 'Actualización exitosa';
        }
        return $output;
    }

    // delete data from database
    function deleteData($tabledb, $id){
        $pdo = connect();
        $sql = "DELETE FROM $tabledb WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $erro_info = $stmt->errorInfo();
        $output = array(
            'success' => false,
            'error' => $erro_info[0],
            'message' => $erro_info[2]
        );
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['message'] = 'Eliminación exitosa';
        }
        return $output;
    }

    if(isset($_POST['get_all_data'])){
        $all_tables = array('agenda', 'usuarios', 'empleados', 'servicios');
        $output = array(
            'success' => true
        );
        foreach($all_tables as $table){
            $data = getData($table);
            if($data['success']){
                $output[$table] = $data['data'];
            }
            else{
                $output['success'] = false;
                $output[$table] = $data['message'];
            }
        }
        echo json_encode($output);
    }
    else if(isset($_POST['getFormAction'])){
        $tabla = $_POST['tabla'];
        $data_post = json_decode($_POST['data']);
        $action = $_POST['action'];
        $id = $data_post->id;

        if($tabla == 'servicio'){
            $tabla = 'servicios';
        }
        if($tabla == 'empleado'){
            $tabla = 'empleados';
        }
        if($tabla == 'usuario'){
            $tabla = 'usuarios';
        }

        if(strtolower($action) == 'agregar'){
            $columns = '';
            $values = '';
            $data = array();
            foreach($data_post as $key => $value){
                if($key != 'id' && $key != 'hora'){
                    $columns .= $key.',';
                    $values .= ':'.$key.',';
                    $data[':'.$key] = $value;
                }
            }
            $columns = rtrim($columns, ',');
            $values = rtrim($values, ',');
            $output = insertData($tabla, $data, $columns, $values);

            if($output['success'] && $tabla == 'empleados' && isset($data_post->servicio)){
                $tabla_rel = 'empleado_servicio';
                $columns_rel = 'empleado_id, servicio_id';
                $values_rel = ':empleado_id, :servicio_id';
                $data_rel = array(
                    ':empleado_id' => $output['id'],
                    ':servicio_id' => $data_post->servicio
                );
                $output_rel = insertData($tabla_rel, $data_rel, $columns_rel, $values_rel);
                if($output_rel['success']){
                    $output['message'] = 'Registro Insertado Correctamente';
                    $output['id'] = $output['id'];
                }
                else{
                    $output['message'] = 'Error al insertar el registro';
                    $output['error'] = true;
                    $output['success'] = false;
                }
            }
        }
        else if(strtolower($action) == 'editar'){
            $columns = '';
            $data_set = '';
            $values = array();
            foreach($data_post as $key => $value){
                if($key != 'id' && $key != 'hora'){
                    $data_set .= $key.'=:'.$key.',';
                    $values[$key] = $value;
                }
            }
            $data_set = rtrim($data_set, ',');
            $output = updateData($tabla, $data_set, $values, $id);
        }
        else if(strtolower($action) == 'eliminar'){
            $output = deleteData($tabla, $id);
        }
        echo json_encode($output);
    }
    
?>