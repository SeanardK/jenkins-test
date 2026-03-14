pipeline {
  agent any

  stages {
    stage('Setup pnpm') {
      steps {
        sh 'pnpm -v || npm install -g pnpm'
      }
    }

    stage('Prepare .env') {
      steps {
        withCredentials([file(credentialsId: 'graphql-book_library_env', variable: 'ENV_FILE')]) {
          sh 'cp $ENV_FILE .env'
        }
      }
    }

    stage('Install') {
      steps {
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('Lint') {
      steps {
        sh 'pnpm run lint || true'
      }
    }

    stage('Test') {
      steps {
        sh 'pnpm run test || true'
      }
    }

    stage('Build') {
      steps {
        sh 'pnpm run build'
      }
    }

    stage('Docker Deploy') {
      steps {
        sh 'docker compose up -d --build'
      }
    }
  }

  post {
    success { echo 'Pipeline completed successfully.' }
    failure { echo 'Pipeline failed.' }
  }
}
