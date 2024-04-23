function loadModule() {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/module",
      method: "GET",
      dataType: "json",
      success: function (response) {
        var html = "";
        if (response.status && Array.isArray(response.data)) {
            console.log(response.data);
            response.data.forEach(function (item) {
              // Construir el HTML para cada objeto
              html += `<option value="${item.id}">${item.name}</option>`;
            });
            $("#multiple-select-field").html(html);
          } else {
            console.error("Error: No se pudo obtener la lista de roles.");
          }
      },
      error: function (error) {
        // Función que se ejecuta si hay un error en la solicitud
        console.error("Error en la solicitud:", error);
      },
    });
  }

  function save(){
    var selectedOptions = $("#multiple-select-field").val();

// Verificar si se han seleccionado opciones en el campo multiple-select-field
if (selectedOptions && selectedOptions.length > 0) {
    // Mapear los valores seleccionados a un array de objetos
    var moduleData = selectedOptions.map(function(option) {
        return { "id": parseInt(option) };
    });

    // Convertir el array de objetos a una cadena separada por comas
    var moduleDataString = moduleData.map(function(obj) {
        return JSON.stringify(obj);
    }).join(',');

    // Parsear la cadena resultante de nuevo a un array de objetos JSON
    var moduleDataArray = JSON.parse('[' + moduleDataString + ']');

    try {
        var data = {
            "name": $("#nombre").val(),
            "description": $("#descripcion").val(),
            "module": moduleDataArray, // Colocar la cadena entre corchetes
            "state": parseInt($("#estado").val())
        };
        console.log("Data:", data); // Para verificar la estructura final de la data
    } catch (error) {
        console.error("Error al construir la data:", error);
    }
} else {
    // Si no se han seleccionado opciones, crear la estructura de datos sin la parte "view"
    try {
        var data = {
            "name": $("#nombre").val(),
            "description": $("#descripcion").val(),
            "state": parseInt($("#estado").val())
        };
        console.log("Data:", data); // Para verificar la estructura final de la data
    } catch (error) {
        console.error("Error al construir la data:", error);
    }
}

    try {
      
        console.log("Data:", data); // Para verificar la estructura final de la data
    
        var jsonData = JSON.stringify(data);
        $.ajax({
          url: "http://localhost:9000/service-security/v1/api/role",
          method: "POST",
          dataType: "json",
          contentType: "application/json",
          data: jsonData,
          success: function(data) {
            Swal.fire({
              title: "perfect!",
              text: "Registro agregado con éxito!",
              icon: "success",
              timer: 8000, // Tiempo en milisegundos (2 segundos en este caso)
              buttons: false // Deshabilitar botones de confirmación y cancelación
          });
            clearData();
            loadData();
          },
          error: function(error) {
            alert(`Error no se pudo realizar el registro.`);
            //console.log($("#person_id").val());
          },
        });
      } catch (error) {
        console.error("Error obteniendo el cliente:", error);
      }
}

function clearData() {
    $("#id").val("");
    $("#nombre").val("");
    $("#descripcion").val("");
    $("#multiple-select-field").val("");
    $("#estado").val("");
    var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Agregar");
        btnAgregar.attr("onclick", "save()");
  }

  function loadData() {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/role",
      method: "GET",
      dataType: "json",
      success: function (response) {
        console.log(response.data);
        var html = "";
        var data = response.data;
        data.forEach(function (item) {
          // Construir el HTML para cada objeto
          if (!item.deletedAt) {
          html +=
            `<tr>
                    <td>${item.name}</td>
                    <td>` + item.description + `</td>
                    <td><ul>` + item.module.reduce((accumulator, currentValue) => accumulator + (`<li>${ currentValue.name }</li>`), '',) + `</ul></td>
                    <td>` + (item.state == true ? "Activo" : "Inactivo") + `</td>
                    <td> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="findById(${item.id})"> <img src="/assets/icon/pencil-square.svg" > </button>
                    <button type="button" class="btn btn-secundary" onclick="deleteById(${item.id})"> <img src="/assets/icon/trash3.svg" > </button></td>
                </tr>`;
          }
        });
  
        $("#resultData").html(html);
      },
      error: function (error) {
        // Función que se ejecuta si hay un error en la solicitud
        console.error("Error en la solicitud:", error);
      },
    });
  }

  function deleteById(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "http://localhost:9000/service-security/v1/api/role/" + id,
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        }).done(function (result) {
          loadData();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        });
      }
    });
  }

  function findById(id) {
    $.ajax({
      url: "http://localhost:9000/service-security/v1/api/role/" + id,
      method: "GET",
      dataType: "json",
      success: function (response) {
        var data=response.data;
        $("#id").val(data.id);
        $('#nombre').val(data.name);
        $('#descripcion').val(data.description);
        // Extraer los valores de 'id' de cada objeto en data.view
        var selectedValues = data.module.map(function(item) {
            return item.id;
        });
        
        // Deseleccionar todas las opciones primero
        $('#multiple-select-field option').prop('selected', false);
        
        // Seleccionar las opciones correspondientes
        selectedValues.forEach(function(value) {
            $('#multiple-select-field option[value="' + value + '"]').prop('selected', true);
        });
        
        // Trigger evento change para actualizar visualización
        $('#multiple-select-field').trigger('change');

        $("#estado").val(data.state == true ? 1 : 0);
        //Cambiar boton.
        var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Actualizar");
        btnAgregar.attr("onclick", "update()");
      },
      error: function (error) {
        // Función que se ejecuta si hay un error en la solicitud
        console.error("Error en la solicitud:", error);
      },
    });
  }

  function update() {
    var selectedOptions = $("#multiple-select-field").val();

// Verificar si se han seleccionado opciones en el campo multiple-select-field
if (selectedOptions && selectedOptions.length > 0) {
    // Mapear los valores seleccionados a un array de objetos
    var moduleData = selectedOptions.map(function(option) {
        return { "id": parseInt(option) };
    });

    // Convertir el array de objetos a una cadena separada por comas
    var moduleDataString = moduleData.map(function(obj) {
        return JSON.stringify(obj);
    }).join(',');

    // Parsear la cadena resultante de nuevo a un array de objetos JSON
    var moduleDataArray = JSON.parse('[' + moduleDataString + ']');

    try {
        var data = {
            "name": $("#nombre").val(),
            "description": $("#descripcion").val(),
            "module": moduleDataArray, // Colocar la cadena entre corchetes
            "state": parseInt($("#estado").val())
        };
        console.log("Data:", data); // Para verificar la estructura final de la data
    } catch (error) {
        console.error("Error al construir la data:", error);
    }
} else {
    // Si no se han seleccionado opciones, crear la estructura de datos sin la parte "view"
    try {
        var data = {
            "name": $("#nombre").val(),
            "description": $("#descripcion").val(),
            "state": parseInt($("#estado").val())
        };
        console.log("Data:", data); // Para verificar la estructura final de la data
    } catch (error) {
        console.error("Error al construir la data:", error);
    }
}
    try{
      
      var id = $("#id").val();
      var jsonData = JSON.stringify(data);
      $.ajax({
        url: "http://localhost:9000/service-security/v1/api/role/" + id,
        data: jsonData,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }).done(function (result) {
        Swal.fire({
          title: "perfect!",
          text: "Registro actualizado con éxito!",
          icon: "success",
          timer: 8000, // Tiempo en milisegundos (2 segundos en este caso)
          buttons: false // Deshabilitar botones de confirmación y cancelación
      });
        loadData();
        clearData();
    
        //actualzar boton
        var btnAgregar = $('button[name="btnAgregar"]');
        btnAgregar.text("Agregar");
        btnAgregar.attr("onclick", "save()");
      });
    }catch (error) {
      alert("Error en actualizar user.");
      console.error("Error en la solicitud:", error);
      //actualzar boton
      loadData();
      clearData();
      var btnAgregar = $('button[name="btnAgregar"]');
      btnAgregar.text("Agregar");
      btnAgregar.attr("onclick", "save()");
    }
  }