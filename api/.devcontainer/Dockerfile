ARG VARIANT=16-bullseye
FROM --platform=arm64 mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# Install the AWS CLI.
RUN mkdir "/tmp/aws" && \
    cd "/tmp/aws" && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" \
        -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

# Install global NPM packages.
RUN su node -c "npm install -g aws-cdk"
