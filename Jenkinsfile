pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@172.31.18.35"
        APP_NAME   = "dashboard-websocket-service"
        APP_PORT   = "3000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh '''
                echo "Connecting to App EC2..."
                ssh ${APP_SERVER} "
                    echo 'Connected to EC2'
                    docker ps
                "
                '''
            }
        }
    }
}
