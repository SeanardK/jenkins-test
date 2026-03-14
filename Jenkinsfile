pipeline {
    agent any

    stages {
        stage('Checkout') {
      steps {
        checkout scm
      }
        }

        stage('Setup pnpm') {
          steps {
            sh 'pnpm -v'
          }
        }
    }

    post {
        success {
          echo 'Pipeline completed successfully.'
        }
        failure {
          echo 'Pipeline failed.'
        }
    }
}
