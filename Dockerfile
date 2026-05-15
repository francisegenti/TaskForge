FROM nginx:alpine

# Copy website files to nginx
COPY . /usr/share/nginx/html

# Copy custom nginx config 
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check for monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1