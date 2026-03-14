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
        sh "npm install -g pnpm@${PNPM_VERSION}"
      }
        }

      //   stage('Install Dependencies') {
      // steps {
      //   sh 'pnpm install --frozen-lockfile'
      // }
      //   }

      //   stage('Lint') {
      // steps {
      //   sh 'pnpm lint'
      // }
      //   }

    //   stage('Build') {
    // steps {
    //   sh 'pnpm build'
    // }
    //   }
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
