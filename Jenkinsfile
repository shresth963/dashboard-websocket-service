pipeline {

    agent any

    environment {
        SERVICE_NAME = "dashboard-websocket-service"
        IMAGE_NAME   = "dashboard-websocket-service:latest"
        PORT         = "3000"
    }

    stages {

        stage ('Checkout') {
            steps {
                // Using HTTPS – No SSH key required
                git branch: 'main', url: 'https://github.com/shresth963/dashboard-websocket-service.git'
            }
        }

        stage ('Build Docker Image') {
            steps {
                sh """
                echo "Building Docker Image..."
                docker build -t ${IMAGE_NAME} .
                """
            }
        }

        stage ('Stop Old Container') {
            steps {
                sh """
                echo "Stopping old container if exists..."
                docker rm -f ${SERVICE_NAME} || true
                """
            }
        }

        stage ('Deploy New Container') {
            steps {
                sh """
                echo "Deploying new container..."
                docker run -d --name ${SERVICE_NAME} -p ${PORT}:${PORT} ${IMAGE_NAME}
                """
            }
        }

        stage('Restart Nginx Proxy') {
            steps {
                sh """
                echo "Restarting nginx proxy..."
                docker restart mynginx || true
                """
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment Completed Successfully!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
