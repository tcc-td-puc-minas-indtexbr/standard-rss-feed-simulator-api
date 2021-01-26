variable "aws_profile" {
  type    = string
  default = "tcc-td-puc-minas-admin"
}

variable "aws_region" {
  type    = string
  default = "sa-east-1"
}

variable "aws_lambda_function_name" {
  type    = string
  default = "standard-rss-feed-simulator-api"
}

variable "aws_lambda_handler" {
  type    = string
  default = "lambda.handler"
}

variable "aws_lambda_runtime" {
  type    = string
  default = "node12"
}

variable "aws_lambda_filename" {
  type    = string
  default = "./dist/deployment.zip"
}
