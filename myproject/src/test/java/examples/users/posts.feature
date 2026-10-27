Feature: GoRest API coverage for posts

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

    * def buildPost =
    """
    function(){
      return {
        title: 'Post ' + dataGenerator.getRandonName(),
        body: 'Body ' + dataGenerator.getRandonName()
      };
    }
    """

  @posts-create
  Scenario: Crear post
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    * def postPayload = buildPost()
    Given path 'users', userId, 'posts'
    And request postPayload
    When method post
    Then status 201
    And match response contains { id: '#number', user_id: '#(userId)', title: '#string', body: '#string' }
    And assert responseTime < 4000

  @posts-update
  Scenario: Actualizar post
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    * def postPayload = buildPost()
    Given path 'users', userId, 'posts'
    And request postPayload
    When method post
    Then status 201
    * def postId = response.id

    * def updatePostPayload = { title: '#("Updated " + dataGenerator.getRandonName())', body: '#("Updated body " + dataGenerator.getRandonName())' }
    Given path 'posts', postId
    And request updatePostPayload
    When method put
    Then status 200
    And match response contains { id: '#(postId)', user_id: '#(userId)', title: '#(updatePostPayload.title)', body: '#(updatePostPayload.body)' }
    And assert responseTime < 4000

  @posts-list-by-user
  Scenario: Obtener posts del usuario
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    * def postPayload = buildPost()
    Given path 'users', userId, 'posts'
    And request postPayload
    When method post
    Then status 201
    * def postId = response.id

    Given path 'users', userId, 'posts'
    When method get
    Then status 200
    And match response[*].id contains postId
    And assert responseTime < 4000

  @posts-list
  Scenario: Obtener posts
    Given path 'posts'
    When method get
    Then status 200
    And match each response contains { id: '#number', user_id: '#number', title: '#string', body: '#string' }
    And assert responseTime < 4000

  @posts-get
  Scenario: Obtener post por id
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    * def postPayload = buildPost()
    Given path 'users', userId, 'posts'
    And request postPayload
    When method post
    Then status 201
    * def postId = response.id

    Given path 'posts', postId
    When method get
    Then status 200
    And match response contains { id: '#(postId)', user_id: '#(userId)', title: '#string', body: '#string' }
    And assert responseTime < 4000

  @posts-delete
  Scenario: Eliminar post
    * def userPayload = buildUser()
    Given path 'users'
    And request userPayload
    When method post
    Then status 201
    * def userId = response.id

    * def postPayload = buildPost()
    Given path 'users', userId, 'posts'
    And request postPayload
    When method post
    Then status 201
    * def postId = response.id

    Given path 'posts', postId
    When method delete
    Then status 204
    And assert responseTime < 4000
