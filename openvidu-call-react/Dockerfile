FROM nginx
RUN mkdir /app
WORKDIR /app
RUN mkdir /home/ubuntu/handsfree/openvidu-call-react/build
ADD /home/ubuntu/handsfree/openvidu-call-react/build /home/ubuntu/handsfree/openvidu-call-react/build
RUN rm /etc/nginx/conf.d/default.conf
COPY ./hyunseok.conf /etc/sites-available/hyunseok.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
