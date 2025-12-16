pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@51.20.131.42"
        APP_NAME   = "dashboard-websocket-service"
        APP_PORT   = "3000"
        IMAGE_NAME = "dashboard-websocket-service:latest"
        APP_DIR    = "/home/ubuntu/dashboard-websocket-service"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Copy Code to EC2') {
            steps {
                sh """
                rsync -avz --delete \
                --exclude=node_modules \
                ./ ${APP_SERVER}:${APP_DIR}
                """
            }
        }

        stage('Build & Deploy on EC2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                    echo "Deploying application..."

                    cd ${APP_DIR} || exit 1

                    docker rm -f ${APP_NAME} || true
                    docker rmi ${IMAGE_NAME} || true

                    docker build -t ${IMAGE_NAME} .
                    docker run -d \
                      --name ${APP_NAME} \
                      -p ${APP_PORT}:${APP_PORT} \
                      ${IMAGE_NAME}

                    docker ps
                '
                """
            }
        }
    }
}
