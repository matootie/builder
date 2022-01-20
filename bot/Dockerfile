ARG VERSION="0.1.0"

FROM python:3.10-slim
ARG VERSION

LABEL org.opencontainers.image.authors "matootie <matootie@icloud.com>"
LABEL org.opencontainers.image.url "https://github.com/matootie/builder#readme"
LABEL org.opencontainers.image.documentation "https://github.com/matootie/builder/wiki"
LABEL org.opencontainers.image.source "https://github.com/matootie/builder.git"
LABEL org.opencontainers.image.vendor "matootie"
LABEL org.opencontainers.image.title "Builder"
LABEL org.opencontainers.image.description "The chatbot for the Builder application. This is the software that responds to gateway events from the Discord API and lives in users Discord servers."

WORKDIR /app
COPY \
  dist/builder-${VERSION}-py3-none-any.whl \
  /app/builder-${VERSION}-py3-none-any.whl
RUN pip install /app/builder-${VERSION}-py3-none-any.whl
CMD ["builder"]
