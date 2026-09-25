FROM rustfs/rc:v0.1.36 AS rc

FROM rustfs/rustfs:1.0.0

COPY --from=rc /usr/bin/rc /usr/bin/rc
COPY --chmod=755 init-entrypoint.sh /init-entrypoint.sh

ENTRYPOINT ["/init-entrypoint.sh"]
CMD ["rustfs"]
