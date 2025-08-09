# CodeDeploy Application and Deployment Group for ECS Blue/Green
resource "aws_codedeploy_app" "api" {
  name = "${var.project}-api-codedeploy"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "api" {
  app_name               = aws_codedeploy_app.api.name
  deployment_group_name  = "${var.project}-api-dg"
  service_role_arn       = aws_iam_role.codedeploy_role.arn

  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"

  ecs_service {
    cluster_name = aws_ecs_cluster.main.name
    service_name = aws_ecs_service.api.name
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route {
        listener_arns = [aws_lb_listener.http.arn]
      }
      target_group {
        name = aws_lb_target_group.blue.name
      }
      target_group {
        name = aws_lb_target_group.green.name
      }
    }
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_ALARM"]
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }
}

# IAM role for CodeDeploy
resource "aws_iam_role" "codedeploy_role" {
  name = "${var.project}-codedeploy-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = ["codedeploy.amazonaws.com"] },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "codedeploy_ecs" {
  role       = aws_iam_role.codedeploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCodeDeployRoleForECS"
}

resource "aws_iam_role_policy_attachment" "codedeploy_ec2" {
  role       = aws_iam_role.codedeploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

# Tagging
resource "aws_codedeploy_app" "api_tag" {
  name = aws_codedeploy_app.api.name
  tags = { Project = var.project }
}