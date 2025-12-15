FROM node:20-bullseye

# Create non-root user for VS Code
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git curl build-essential python3 \
  && rm -rf /var/lib/apt/lists/*

# Create the user
RUN groupadd --gid $USER_GID $USERNAME || true \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME || true

USER $USERNAME
WORKDIR /home/$USERNAME/workspace

# Enable corepack and ensure pnpm is available
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PATH="/home/$USERNAME/.local/share/pnpm:/home/$USERNAME/.local/share/pnpm/node_modules/.bin:${PATH}"

CMD ["/bin/bash"]
