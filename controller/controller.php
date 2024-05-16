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
        $sql = "SELECT * FROM $tabledb";
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
            'message' => $erro_info[2]
        );
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['message'] = 'Data inserted successfully';
            $output['id'] = $pdo->lastInsertId();
            $output['data'] = $data;
            $output['columnas'] = $columns;
            $output['valores'] = $values;
        }
        return $output;
    }

    // update data in database
    function updateData($tabledb, $columns, $data, $id){
        $pdo = connect();
        $sql = "UPDATE $tabledb SET $columns WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        foreach($data as $key => $value){
            $stmt->bindParam(':'.$key, $value);
        }
        $stmt->execute();
        $erro_info = $stmt->errorInfo();
        $output = array(
            'success' => false,
            'error' => $erro_info[0],
            'message' => $erro_info[2]
        );
        if($erro_info[0] == '00000'){
            $output['success'] = true;
            $output['message'] = 'Data updated successfully';
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
            $output['message'] = 'Data deleted successfully';
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
                    $output['message'] = 'Data inserted successfully';
                }
                else{
                    $output['message'] = $output_rel['message'];
                }
            }
        }
        else if($action == 'update'){
            $columns = '';
            $data = array();
            foreach($data as $key => $value){
                if($key != 'id'){
                    $columns .= $key.'=:'.$key.',';
                    $data[':'.$key] = $value;
                }
            }
            $columns = rtrim($columns, ',');
            $output = updateData($tabla, $columns, $data, $id);
        }
        else if($action == 'delete'){
            $output = deleteData($tabla, $id);
        }
        echo json_encode($output);
    }
    
?>