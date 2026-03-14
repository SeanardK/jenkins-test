pipeline {
  agent any

  parameters {
    booleanParam(name: 'DEPLOY', defaultValue: false, description: 'If true, run container after build')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Setup pnpm') {
      steps {
        sh 'pnpm -v || npm install -g pnpm'
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
      when { expression { return params.DEPLOY == true } }
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
