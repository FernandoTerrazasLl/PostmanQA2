@nuevosScripts @relojMundial
Feature: Gestión del reloj mundial

  Background:
    Given Estoy en la pestaña de reloj mundial

  @agregarCiudad
  Scenario: Agregar una ciudad al reloj mundial
    When Agrego la ciudad "La Paz" al reloj mundial
    Then La ciudad "La Paz" debería estar visible en el reloj mundial

  @eliminarCiudad
  Scenario: Eliminar una ciudad del reloj mundial
    Given La ciudad "La Paz" existe en el reloj mundial
    When Elimino la ciudad "La Paz" del reloj mundial
    Then La ciudad "La Paz" no debería existir en el reloj mundial
