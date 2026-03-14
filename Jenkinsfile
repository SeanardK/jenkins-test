pipeline {
    agent docker-agent

    environment {
        NODE_VERSION = '20'
        PNPM_VERSION = '9'
    }

    tools {
        nodejs "NodeJS-${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup pnpm') {
            steps {
                sh "npm install -g pnpm@${PNPM_VERSION}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install --frozen-lockfile'
            }
        }

        stage('Lint') {
            steps {
                sh 'pnpm lint'
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm build'
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
        always {
            cleanWs()
        }
    }
}
