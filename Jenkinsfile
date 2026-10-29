pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 35, unit: 'MINUTES')
    }
    parameters {
        choice(name: 'APPIUM_TARGET', choices: ['local', 'browserstack'], description: 'Destino de las pruebas móviles')
        choice(name: 'APPIUM_SUITE', choices: ['smoke', 'full'], description: 'Smoke: cronómetro; full: ocho escenarios de Reloj')
        string(name: 'BROWSERSTACK_APP_ID', defaultValue: '', description: 'Opcional: bs://... del mismo APK Reloj subido manualmente. Vacío: cargar el APK desde Jenkins.')
    }
    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
        ANDROID_HOME = "/Users/terrazasllanosfernando/Library/Android/sdk"
        JAVA_HOME = "/Users/terrazasllanosfernando/Library/Java/JavaVirtualMachines/jbr-21.0.8/Contents/Home"
        APPIUM_APP_PATH = "/Users/terrazasllanosfernando/Downloads/Clock.apk"
    }
    stages {
        stage('Preparación') {
            steps {
                sh 'node --version && npm --version && newman --version && mvn --version'
                dir('webdriverio') {
                    sh 'npm ci --no-audit --no-fund'
                }
            }
        }
        stage('Newman') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    // Se conserva el comando y el comportamiento del job existente.
                    sh '''
                        mkdir -p reports
                        newman run GoRest.postman_collection.json -e GoRest.postman_environment.json -r cli,html --reporter-html-export "reports/Newman_Report.html" -x
                    '''
                }
            }
            post {
                always {
                    publishHTML(target: [
                        reportName: 'Newman HTML Report',
                        reportDir: 'reports',
                        reportFiles: 'Newman_Report.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        allowMissing: true
                    ])
                }
            }
        }
        stage('WebdriverIO') {
            steps {
                dir('webdriverio') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit testResults: 'webdriverio/reports/junit/*.xml', allowEmptyResults: false
                    archiveArtifacts artifacts: 'webdriverio/reports/**/*', allowEmptyArchive: true
                }
            }
        }
        stage('Karate') {
            steps {
                dir('myproject') {
                    withCredentials([string(credentialsId: 'gorest-api-token', variable: 'GOREST_TOKEN')]) {
                        sh 'mvn test'
                    }
                }
            }
            post {
                always {
                    junit testResults: 'myproject/target/surefire-reports/*.xml', allowEmptyResults: true
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'myproject/target/karate-reports',
                        reportFiles: 'karate-summary.html',
                        reportName: 'Reporte de Pruebas Karate'
                    ])
                }
            }
        }
        stage('Appium') {
            options { timeout(time: 15, unit: 'MINUTES') }
            steps {
                dir('appiumCucumberPOM') {
                    sh 'npm ci --no-audit --no-fund'
                    script {
                        if (params.APPIUM_TARGET == 'browserstack') {
                            withCredentials([usernamePassword(credentialsId: 'browserstack-account', usernameVariable: 'BROWSERSTACK_USERNAME', passwordVariable: 'BROWSERSTACK_ACCESS_KEY')]) {
                                def appId = params.BROWSERSTACK_APP_ID?.trim()
                                if (!appId) {
                                    appId = sh(script: 'node scripts/upload-app.cjs', returnStdout: true).trim()
                                }
                                if (!(appId ==~ /bs:\/\/[a-fA-F0-9]{40}/)) {
                                    error('BROWSERSTACK_APP_ID debe ser un identificador bs:// seguido de 40 caracteres hexadecimales.')
                                }
                                withEnv(["BROWSERSTACK_APP_ID=${appId}"]) {
                                    sh 'npm run test:browserstack'
                                }
                            }
                        } else {
                            sh 'npm run test:local'
                        }
                    }
                }
            }
            post {
                always {
                    junit testResults: 'appiumCucumberPOM/reports/junit/*.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'appiumCucumberPOM/reports/**/*', allowEmptyArchive: true
                }
            }
        }
    }
    post {
        always {
            script {
                try {
                    def resultDirs = ['webdriverio/reports/allure-results', 'appiumCucumberPOM/reports/allure-results']
                        .findAll { fileExists(it) }.collect { [path: it] }
                    if (resultDirs) {
                        allure includeProperties: false, jdk: '', results: resultDirs
                    }
                } finally {
                    echo 'Pipeline finalizado — limpiando workspace.'
                    cleanWs()
                }
            }
        }
        success {
            echo 'Pruebas Newman, WebdriverIO, Karate y Appium ejecutadas con éxito.'
        }
        failure {
            echo 'Falló alguna etapa del pipeline.'
        }
    }
}
