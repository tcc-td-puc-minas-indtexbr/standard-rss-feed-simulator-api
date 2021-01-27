variable "project_name" {
  type = string
  default = "standard-rss-feed-simulator-api"
}

variable "aws_profile" {
  type    = string
  default = "tcc-td-puc-minas-admin"
}

variable "aws_region" {
  type    = string
  default = "sa-east-1"
}

variable "aws_lambda_handler" {
  type    = string
  default = "lambda.handler"
}

variable "aws_lambda_runtime" {
  type    = string
  default = "nodejs12.x"
}

variable "aws_lambda_filename" {
  type    = string
  default = "../dist/deployment.zip"
}

variable "aws_lambda_source_dir" {
  type    = string
  default = "../target"
}


variable "aws_codepipeline_organization_id" {
  default = "tcc-td-puc-minas-indtexbr"
}

variable "aws_codepipeline_branch_name" {
  default = "master"
}



# ------------------------------------
# Sensitive variables
# ------------------------------------
variable "aws_codestar_connection_arn" {
  type        = string
  description = "CodeStar connection ARN required for Bitbucket integration with CodePipeline"
  default     = ""
}

variable "aws_codebuild_role_arn" {
  default = ""
}

variable "aws_codedeploy_role_arn" {
  default = ""
}

variable "aws_codepipeline_bucket" {
  default = ""
}

