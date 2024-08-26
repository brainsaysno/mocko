ARG GO_VERSION=1
FROM golang:${GO_VERSION}-bookworm as builder

WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN go build -v -o /run-app .

FROM debian:bookworm

# Install necessary packages
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl

# Download and install the SSL certificate
RUN curl -o /usr/local/share/ca-certificates/api.openai.com.crt https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem \
    && update-ca-certificates

# Copy the built application from the builder stage
COPY --from=builder /run-app /usr/local/bin/

# Run the application
CMD ["run-app"]
