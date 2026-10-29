@nuevosScripts @temporizador
Feature: Uso del temporizador

  Background:
    Given Estoy en la pestaña de temporizador

  @pausarTemporizador
  Scenario: Configurar, iniciar y pausar un temporizador
    When Configuro un temporizador de un minuto
    And Inicio el temporizador
    And Pauso el temporizador
    Then El temporizador debería estar pausado
