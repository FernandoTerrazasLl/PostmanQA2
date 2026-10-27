Feature: GoRest usuarios

  Background:
    * url gorestBaseUrl
    * configure headers =
    """
    function(){
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + gorestToken
      };
    }
    """
    * def dataGenerator = Java.type('utils.DataGenerator')

    * def buildUser =
    """
    function(){
      return {
        name: dataGenerator.getRandonName(),
        email: dataGenerator.getEmailRandom(),
        gender: 'male',
        status: 'active'
      };
    }
    """


  @users-create
  Scenario: Crear usuario
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    And match response contains { id: '#number', name: '#string', email: '#string', gender: '#string', status: '#string' }
    And assert responseTime < 4000

  @users-list
  Scenario: Obtener usuarios
    Given path 'users'
    When method get
    Then status 200
    And match each response contains { id: '#number', name: '#string', email: '#string', gender: '#string', status: '#string' }
    And assert responseTime < 4000

  @users-get
  Scenario: Obtener usuario por id
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    Given path 'users', userId
    When method get
    Then status 200
    And match response.id == userId
    And match response.email == userPayload.email
    And assert responseTime < 4000

  @users-update
  Scenario: Editar usuario
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    * def updatePayload = { name: '#(dataGenerator.getRandonName())', email: '#(dataGenerator.getEmailRandom())', gender: 'female', status: 'inactive' }
    Given path 'users', userId
    And request updatePayload
    When method put
    Then status 200
    And match response contains { id: '#number', name: '#(updatePayload.name)', email: '#(updatePayload.email)', gender: 'female', status: 'inactive' }
    And assert responseTime < 4000

  @users-delete
  Scenario: Eliminar usuario
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    Given path 'users', userId
    When method delete
    Then status 204
    And assert responseTime < 4000