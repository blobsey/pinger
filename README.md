# Pinger!

Does a connectivity test periodically on a website, hehehe...

## Prerequisites

### Node v24
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm use 24
```

### GCC and Make
```
sudo dnf install gcc gcc-c++ make
```


## Handy commands
```
npx cdk synth
npx cdk list
npx cdk deploy <stack-name>
```

### Testing (Locally)
```
cargo lambda watch
cargo lambda invoke --data-ascii '{
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "detail": {}
}'
```

### Deploying
```
./deploy.sh
```