# Cinerino Jobs Application

[![CircleCI](https://circleci.com/gh/cinerino/jobs.svg?style=svg)](https://circleci.com/gh/cinerino/jobs)

## Table of contents

* [Usage](#usage)
* [License](#license)

## Usage

### Environment variables

| Name                                      | Required              | Value           | Purpose                          |
|-------------------------------------------|-----------------------|-----------------|----------------------------------|
| `DEBUG`                                   | false                 | cinerino-jobs:* | Debug                            |
| `NODE_ENV`                                | true                  |                 | Environment name                 |
| `MONGOLAB_URI`                            | true                  |                 | MongoDB connection URI           |
| `REDIS_HOST`                              | true                  |                 | Redis Cache host                 |
| `REDIS_PORT`                              | true                  |                 | Redis Cache port                 |
| `REDIS_KEY`                               | true                  |                 | Redis Cache key                  |
| `SENDGRID_API_KEY`                        | true                  |                 | SendGrid API Key                 |
| `DEVELOPER_EMAIL`                         | true                  |                 | Developer email                  |
| `DEVELOPER_LINE_NOTIFY_ACCESS_TOKEN`      | true                  |                 | Develper LINE Notify token       |
| `LENGTH_IMPORT_SCREENING_EVENTS_IN_WEEKS` | true                  |                 | Screening events import period   |
| `GMO_ENDPOINT`                            | true                  |                 | GMO API endpoint                 |
| `GMO_SITE_ID`                             | true                  |                 | GMO SiteID                       |
| `GMO_SITE_PASS`                           | true                  |                 | GMO SitePass                     |
| `PECORINO_ENDPOINT`                       | true                  |                 | Pecorino endpoint                |
| `PECORINO_AUTHORIZE_SERVER_DOMAIN`        | true                  |                 | Pecorino authorize server domain |
| `PECORINO_CLIENT_ID`                      | true                  |                 | Pecorino client id               |
| `PECORINO_CLIENT_SECRET`                  | true                  |                 | Pecorino client secret           |
| `CHEVRE_ENDPOINT`                         | true                  |                 | Chevre endpoint                  |
| `CHEVRE_AUTHORIZE_SERVER_DOMAIN`          | true                  |                 | Chevre authorize server domain   |
| `CHEVRE_CLIENT_ID`                        | true                  |                 | Chevre client id                 |
| `CHEVRE_CLIENT_SECRET`                    | true                  |                 | Chevre client secret             |
| `AWS_ACCESS_KEY_ID`                       | true                  |                 | AWS access key                   |
| `AWS_SECRET_ACCESS_KEY`                   | true                  |                 | AWS secret access key            |
| `COGNITO_USER_POOL_ID`                    | true                  |                 | Cognito user pool ID             |
| `WEBJOBS_ROOT_PATH`                       | only on Azure WebApps | dst/jobs        |                                  |

## License

ISC
