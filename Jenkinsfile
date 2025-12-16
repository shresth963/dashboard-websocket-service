pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@51.20.131.42"
        APP_NAME   = "dashboard-websocket-service"
        APP_PORT   = "3000"
        IMAGE_NAME = "dashboard-websocket-service:latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy on EC2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                    echo "Deploying application..."

                    docker rm -f ${APP_NAME} || true
                    docker rmi ${IMAGE_NAME} || true

                    cd ~/${APP_NAME} || exit 1
                    docker build -t ${IMAGE_NAME} .
                    docker run -d --name ${APP_NAME} -p ${APP_PORT}:${APP_PORT} ${IMAGE_NAME}

                    docker ps
                '
                """
            }
        }
    }
}
