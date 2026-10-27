Feature: GoRest API coverage for comments

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

    * def buildComment =
    """
    function(){
      return {
        name: dataGenerator.getRandonName(),
        email: dataGenerator.getEmailRandom(),
        body: 'Comment ' + dataGenerator.getRandonName()
      };
    }
    """

  @comments-create
  Scenario: Crear comment
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

    * def commentPayload = buildComment()
    Given path 'posts', postId, 'comments'
    And request commentPayload
    When method post
    Then status 201
    And match response contains { id: '#number', post_id: '#(postId)', name: '#string', email: '#string', body: '#string' }
    And assert responseTime < 4000

  @comments-update
  Scenario: Actualizar comment
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

    * def commentPayload = buildComment()
    Given path 'posts', postId, 'comments'
    And request commentPayload
    When method post
    Then status 201
    * def commentId = response.id

    * def updateCommentPayload = { name: '#(dataGenerator.getRandonName())', email: '#(dataGenerator.getEmailRandom())', body: '#("Updated comment " + dataGenerator.getRandonName())' }
    Given path 'comments', commentId
    And request updateCommentPayload
    When method put
    Then status 200
    And match response contains { id: '#(commentId)', post_id: '#(postId)', name: '#(updateCommentPayload.name)', email: '#(updateCommentPayload.email)', body: '#(updateCommentPayload.body)' }
    And assert responseTime < 4000

  @comments-list-by-post
  Scenario: Obtener comments del post
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

    * def commentPayload = buildComment()
    Given path 'posts', postId, 'comments'
    And request commentPayload
    When method post
    Then status 201
    * def commentId = response.id

    Given path 'posts', postId, 'comments'
    When method get
    Then status 200
    And match response[*].id contains commentId
    And assert responseTime < 4000

  @comments-list
  Scenario: Obtener comments
    Given path 'comments'
    When method get
    Then status 200
    And match each response contains { id: '#number', post_id: '#number', name: '#string', email: '#string', body: '#string' }
    And assert responseTime < 4000

  @comments-get
  Scenario: Obtener comment por id
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

    * def commentPayload = buildComment()
    Given path 'posts', postId, 'comments'
    And request commentPayload
    When method post
    Then status 201
    * def commentId = response.id

    Given path 'comments', commentId
    When method get
    Then status 200
    And match response contains { id: '#(commentId)', post_id: '#(postId)', name: '#string', email: '#string', body: '#string' }
    And assert responseTime < 4000

  @comments-delete
  Scenario: Eliminar comment
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

    * def commentPayload = buildComment()
    Given path 'posts', postId, 'comments'
    And request commentPayload
    When method post
    Then status 201
    * def commentId = response.id

    Given path 'comments', commentId
    When method delete
    Then status 204
    And assert responseTime < 4000
