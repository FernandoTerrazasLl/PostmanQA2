pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }
    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
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
                    allure includeProperties: false,
                        jdk: '',
                        results: [[path: 'webdriverio/reports/allure-results']]
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
    }
    post {
        always {
            echo 'Pipeline finalizado — limpiando workspace.'
            cleanWs()
        }
        success {
            echo 'Pruebas Karate ejecutadas con éxito.'
        }
        failure {
            echo 'Falló alguna etapa del pipeline.'
        }
    }
}
