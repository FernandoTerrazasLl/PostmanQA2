@nuevosScripts @cronometro
Feature: Uso del cronómetro

  Background:
    Given Estoy en la pestaña de cronómetro

  @pausarCronometro
  Scenario: Iniciar y pausar el cronómetro
    When Inicio el cronómetro
    And Pauso el cronómetro
    Then El cronómetro debería estar pausado

  @registrarVuelta
  Scenario: Registrar una vuelta en el cronómetro
    When Inicio el cronómetro
    And Registro una vuelta del cronómetro
    Then La vuelta del cronómetro debería estar visible
