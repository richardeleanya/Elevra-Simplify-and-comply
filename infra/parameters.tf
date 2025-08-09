resource "aws_ssm_parameter" "api_jwt_secret" {
  name  = "/simplify/api/jwt_secret"
  type  = "SecureString"
  value = var.api_jwt_secret
  overwrite = true
}

resource "aws_ssm_parameter" "api_db_password" {
  name  = "/simplify/api/db_password"
  type  = "SecureString"
  value = var.db_password
  overwrite = true
}

resource "aws_ssm_parameter" "api_sentry_dsn" {
  name  = "/simplify/api/sentry_dsn"
  type  = "SecureString"
  value = var.api_sentry_dsn
  overwrite = true
}

resource "aws_ssm_parameter" "web_sentry_dsn" {
  name  = "/simplify/web/sentry_dsn"
  type  = "SecureString"
  value = var.web_sentry_dsn
  overwrite = true
}

resource "aws_ssm_parameter" "mobile_sentry_dsn" {
  name  = "/simplify/mobile/sentry_dsn"
  type  = "SecureString"
  value = var.mobile_sentry_dsn
  overwrite = true
}