#!/bin/bash
echo 'Running after_install.sh' >> /home/ec2-user/event-planner/deploy.log
cd /home/ec2-user/event-planner
npm install
npm run build
