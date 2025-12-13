pipeline {
    agent any

    environment {
        EC2_IP = "18.191.132.223"
        APP_NAME = "dashboard-websocket-service"
    }

    stages {

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                        cd /home/ubuntu
                        rm -rf ${APP_NAME} || true
                        git clone https://github.com/shresth963/dashboard-websocket-service.git
                        cd ${APP_NAME}

                        docker build -t ${APP_NAME}:latest .
                        docker rm -f ${APP_NAME} || true
                        docker run -d --name ${APP_NAME} -p 3000:3000 ${APP_NAME}:latest
                    '
                    """
                }
            }
        }
    }
}
