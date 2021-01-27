locals {
  aws_codepipeline_name = var.project_name
  aws_codepipeline_repository_id = join("/", [
    var.aws_codepipeline_organization_id,
    var.project_name])
}

resource "aws_codepipeline" "codepipeline" {
  name = local.aws_codepipeline_name
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.codepipeline_bucket.bucket
    type = "S3"
  }

  stage {
    name = "Source"

    action {
      name = "Source"
      category = "Source"
      owner = "AWS"
      provider = "CodeStarSourceConnection"
      version = "1"
      namespace = "SourceVariables"
      output_artifacts = [
        "SourceArtifact"]

      configuration = {
        ConnectionArn = var.aws_codestar_connection_arn
        FullRepositoryId = local.aws_codepipeline_repository_id
        BranchName = var.aws_codepipeline_branch_name
        OutputArtifactFormat = "CODE_ZIP"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name = "Build"
      category = "Build"
      owner = "AWS"
      provider = "CodeBuild"
      version = "1"
      namespace = "BuildVariables"
      input_artifacts = [
        "SourceArtifact"
      ]
      output_artifacts = [
        "BuildArtifact"
      ]

//      role_arn = var.aws_codebuild_role_arn

      configuration = {
        ProjectName = "generic_lambda"
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name = "Deploy"
      category = "Deploy"
      owner = "AWS"
      provider = "CloudFormation"
      input_artifacts = [
        "BuildArtifact"]
      version = "1"
//      role_arn        = var.aws_codedeploy_role_arn
      configuration = {
        //        ActionMode     = "REPLACE_ON_FAILURE"
        ActionMode = "CREATE_UPDATE"
        Capabilities = "CAPABILITY_AUTO_EXPAND,CAPABILITY_IAM,CAPABILITY_NAMED_IAM"
        //        OutputFileName = "CreateStackOutput.json"
        StackName = join("-", [
          var.project_name,
          "stack"])
        TemplatePath = "build_output::packaged.yaml"


      }
    }
  }
}

resource "aws_s3_bucket" "codepipeline_bucket" {
  bucket = var.aws_codepipeline_bucket
  acl = "private"
}

resource "aws_iam_role" "codepipeline_role" {
  name = "codepipeline_lambda_role"

  assume_role_policy = file("policies/iam/aws_codepipeline_role.json")
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "codepipeline_lambda_policy"
  role = aws_iam_role.codepipeline_role.id

  policy = file("policies/iam/aws_codepipeline_policy.json")
}

//data "aws_kms_alias" "s3kmskey" {
//  name = "alias/myKmsKey"
//}