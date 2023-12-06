FROM registry.cn-hongkong.aliyuncs.com/oceanpayment/odp-service-image:nginx-1.20.0
EXPOSE 8443
COPY ./dist/ /usr/share/nginx/html/{{projectName}}
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -f /etc/nginx/conf.d/default.conf 
WORKDIR /usr/share/nginx/html/{{projectName}}
CMD ["nginx","-g","daemon off;"]

