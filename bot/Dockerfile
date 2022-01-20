ARG VERSION="0.1.0"

FROM python:3.10-slim
ARG VERSION
WORKDIR /app
COPY \
  dist/builder-${VERSION}-py3-none-any.whl \
  /app/builder-${VERSION}-py3-none-any.whl
RUN pip install /app/builder-${VERSION}-py3-none-any.whl
CMD ["builder"]
