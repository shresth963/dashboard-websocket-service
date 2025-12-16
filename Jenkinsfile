pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@51.20.131.42"
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
