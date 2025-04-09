#!/bin/bash
echo 'Running application_start.sh' >> /home/ec2-user/event-planner/deploy.log
pm2 restart 'react-event-planner'
